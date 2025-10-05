document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("task-form");
  const taskTitleInput = document.getElementById("task-title-input");
  const taskDescriptionInput = document.getElementById(
    "task-description-input"
  );
  const taskDueDateInput = document.getElementById("task-due-date-input");
  const taskList = document.getElementById("task-list");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");
  const emptyState = document.getElementById("empty-state");

  const editModal = document.getElementById("edit-modal");
  const editTitleInput = document.getElementById("edit-title-input");
  const editDescriptionInput = document.getElementById(
    "edit-description-input"
  );
  const editDueDateInput = document.getElementById("edit-due-date-input");
  const saveEditBtn = document.getElementById("save-edit");
  const cancelEditBtn = document.getElementById("cancel-edit");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let editTaskId = null;

  const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const renderTasks = () => {
    taskList.innerHTML = "";
    if (tasks.length === 0) {
      emptyState.classList.remove("hidden");
    } else {
      emptyState.classList.add("hidden");
      tasks.forEach((task) => {
        const taskElement = document.createElement("div");
        taskElement.className = `task-item ${
          task.completed ? "completed" : ""
        }`;
        taskElement.dataset.id = task.id;

        const formattedDate = task.dueDate
          ? new Date(task.dueDate + "T00:00:00").toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "No due date";

        taskElement.innerHTML = `
                            <div class="task-item-left">
                                <button class="complete-btn">
                                    <i class="${
                                      task.completed
                                        ? "fa-solid fa-check-circle"
                                        : "fa-regular fa-circle"
                                    }"></i>
                                </button>
                                <div class="task-content">
                                    <span class="task-title">${
                                      task.title
                                    }</span>
                                    ${
                                      task.description
                                        ? `<p class="task-description">${task.description}</p>`
                                        : ""
                                    }
                                    ${
                                      task.dueDate
                                        ? `<div class="task-due-date"><i class="fa-regular fa-calendar"></i><span>${formattedDate}</span></div>`
                                        : ""
                                    }
                                </div>
                            </div>
                            <div class="task-actions">
                                <button class="edit-btn">
                                    <i class="fa-solid fa-pencil"></i>
                                </button>
                                <button class="delete-btn">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        `;
        taskList.appendChild(taskElement);
      });
    }
    updateProgress();
  };

  const updateProgress = () => {
    const completedTasks = tasks.filter((task) => task.completed).length;
    const totalTasks = tasks.length;
    const progressPercentage =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    progressBar.style.width = `${progressPercentage}%`;
    progressText.textContent = `${Math.round(progressPercentage)}%`;
  };

  const addTask = (title, description, dueDate) => {
    if (title.trim() === "") return;
    const newTask = {
      id: Date.now(),
      title: title,
      description: description,
      dueDate: dueDate,
      completed: false,
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
  };

  const toggleComplete = (id) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    }
  };

  const deleteTask = (id) => {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
  };

  const openEditModal = (id) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      editTaskId = id;
      editTitleInput.value = task.title;
      editDescriptionInput.value = task.description;
      editDueDateInput.value = task.dueDate;
      editModal.classList.remove("hidden");
      editTitleInput.focus();
    }
  };

  const closeEditModal = () => {
    editModal.classList.add("hidden");
    editTaskId = null;
  };

  const saveTaskEdit = () => {
    const newTitle = editTitleInput.value.trim();
    if (newTitle && editTaskId) {
      const task = tasks.find((task) => task.id === editTaskId);
      if (task) {
        task.title = newTitle;
        task.description = editDescriptionInput.value.trim();
        task.dueDate = editDueDateInput.value;
        saveTasks();
        renderTasks();
        closeEditModal();
      }
    }
  };

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addTask(
      taskTitleInput.value,
      taskDescriptionInput.value,
      taskDueDateInput.value
    );
    taskTitleInput.value = "";
    taskDescriptionInput.value = "";
    taskDueDateInput.value = "";
  });

  taskList.addEventListener("click", (e) => {
    const target = e.target.closest("button");
    if (!target) return;

    const parentTaskElement = e.target.closest("[data-id]");
    if (!parentTaskElement) return;

    const taskId = Number(parentTaskElement.dataset.id);

    if (target.classList.contains("complete-btn")) {
      toggleComplete(taskId);
    } else if (target.classList.contains("delete-btn")) {
      deleteTask(taskId);
    } else if (target.classList.contains("edit-btn")) {
      openEditModal(taskId);
    }
  });

  saveEditBtn.addEventListener("click", saveTaskEdit);
  cancelEditBtn.addEventListener("click", closeEditModal);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !editModal.classList.contains("hidden")) {
      closeEditModal();
    }
  });

  editModal.addEventListener("click", (e) => {
    if (e.target === editModal) {
      closeEditModal();
    }
  });

  renderTasks();
});
