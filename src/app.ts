type Task = {
  title: string
  completed: boolean
}

const taskList = document.getElementById("list") as HTMLUListElement;
const form = document.getElementById("new-task-form") as HTMLFormElement;
const input = document.getElementById("new-task-title") as HTMLInputElement;
const clear = document.getElementById("clear") as HTMLButtonElement;
const pendingTasks = document.getElementById("pending-tasks") as HTMLDivElement;
let activeEdit = false;
let tasks: Task[] = loadTasks(); // * using localStorage to load tasks (if they exist)

pendingTasks.innerText = "You have 0 pending tasks"

function initUI(): void {
  if (taskList.textContent !== '') {
    taskList.textContent = '';
  }

  input.value = '';
  taskArrange(); // * For page reloads (arranges tasks by rules)
  // loadTasks();
  // * For page reloads (for each task, a 'li' element is created and added)
  tasks.forEach(addListItem);
}

// * Event listener for form completion
form?.addEventListener("submit", e => {
  e.preventDefault(); // * preventing page refresh

  let text = input?.value;
  if (text === "" || text === null) return; // * no text input (nothing happens)

  if (text.trim().length === 0) { // * Only space input (not a task)
    input.value = ""; // * reset text bar
    return;
  }
  // * next code: text has been submitted, task is created
  const newTask: Task = {
    title: input.value,
    completed: false
  }

  tasks = [newTask].concat(tasks); // * rearranging the task (recent task is first)
  saveTasks(); // * localStorage is also updated
  initUI();

})

// * Clear button, remove all & refresh page
clear.addEventListener("click", () => {
  console.log("pressed");
  // localStorage.removeItem("TASKS");
  tasks = [];
  saveTasks();
  pendingTasks.innerText = "You have 0 pending tasks"
  initUI();

})

// * Adds 'li' element for Task object
function addListItem(task: Task): void {
  const item = document.createElement("li");
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  const editPlaceholder = document.createElement("form");

  let buttonsContainer = makeButtons(task, editPlaceholder);

  // * each task 'tick' will cause this
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked; // * task modified
    saveTasks(); // * task is changed, mandatory update!
    initUI();
  })

  checkbox.type = "checkbox";
  checkbox.checked = task.completed;

  label.append(checkbox, task.title);
  if (task.completed) { // * adding strike if task done (upon refresh)
    const s = document.createElement("s");
    s.append(label);
    item.append(s, editPlaceholder, buttonsContainer);
  }
  else { item.append(label, editPlaceholder, buttonsContainer); }

  taskList?.append(item); // * '?' to prevent error when taskList == null

  taskCount();

}

// * Save tasks on local storage
function saveTasks(): void {
  localStorage.setItem("TASKS", JSON.stringify(tasks));
}

// * Load tasks from local storage
function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem("TASKS");
  if (taskJSON === null) return []; // * If there are no tasks
  return JSON.parse(taskJSON); // * At least one task
}

// * Delete task from list
function deleteTask(task: Task): void {
  console.log("del clicked");
  let count = 0;
  for (let instance of tasks) {
    if (instance === task) {
      break;
    }
    else count++;
  }
  tasks.splice(count, 1); // * deleting the task from list
  saveTasks(); // * Applying to localStorage
  initUI(); // * Refreshing UI
}

// * Prompts an "edit task" window and updates it
function editTask(task: Task, editPlaceholder: HTMLFormElement): void {
  // * Checks if there is a previous edit, removes it
  if (activeEdit) {
    const editList = document.body.getElementsByClassName("edit-element");
    for (let element of editList) {
      element.firstChild?.remove();
      element.lastChild?.remove();
    }
  }

  // * Checks if there's an edit element already
  if (editPlaceholder.innerHTML !== "") return;

  // * if false, create edit element
  activeEdit = true;

  const editInput = document.createElement("input");
  editPlaceholder.classList.add("edit-element");

  // * Configuring elements for edit
  editInput.setAttribute("type", "text");
  editInput.setAttribute("autocomplete", "off");
  editInput.setAttribute("id", "edit-title");
  editInput.setAttribute("placeholder", "update task..")
  const finish = document.createElement("button");
  finish.setAttribute("type", "submit");
  finish.setAttribute("style", "font-size:15px")
  finish.innerText = "???";

  // * Applying them on the HTML
  editPlaceholder.appendChild(editInput);
  editPlaceholder.appendChild(finish);

  // * When clicking ??? -> save tasks, ends edit, reloads UI
  editPlaceholder.addEventListener("submit", () => {
    const value = editInput?.value;;
    if (value.trim().length !== 0) {
      task.title = editInput?.value;
      saveTasks();
      activeEdit = false;
    }
    initUI();
  })
}

// * Updates task number on UI
function taskCount(): void {
  let completed: number = 0;
  for (let task of tasks) {
    if (task.completed) { completed++; }
  }
  let uncompletedTasks: number = tasks.length - completed;
  if (uncompletedTasks > 1 || uncompletedTasks === 0) {
    pendingTasks.innerText = "You have " + uncompletedTasks + " pending tasks";
  }
  else {
    pendingTasks.innerText = "You have 1 pending task"
  }
}

// * Rearranges tasks so that uncompleted tasks are first
function taskArrange(): void {
  let completedTasks: Task[] = [];
  let uncompletedTasks: Task[] = [];
  for (let task of tasks) {
    if (task.completed) { completedTasks.push(task); }
    else { uncompletedTasks.push(task); }
  }
  tasks = uncompletedTasks.concat(completedTasks);
}

// * Moves given task up in list order
function moveUp(task: Task): void {
  let index = 0; // * index of task in task array
  for (let tempTask of tasks) {
    if (tempTask === task) break;
    index++;
  }
  if (index === 0) return;
  let newArr = tasks.slice(0, index - 1);
  let arr2 = tasks.slice(index + 1);
  newArr.push(task);
  newArr.push(tasks[index - 1]);
  tasks = newArr.concat(arr2);
  saveTasks();
  initUI();
}

// * Moves given task down in list order
function moveDown(task: Task): void {
  let index = 0; // * index of task in task array
  for (let tempTask of tasks) {
    if (tempTask === task) break;
    index++;
  }
  if (index === tasks.length - 1) return;
  let newArr = tasks.slice(0, index);
  let arr2 = tasks.slice(index + 2);
  newArr.push(tasks[index + 1]);
  newArr.push(task);
  tasks = newArr.concat(arr2);
  saveTasks();
  initUI();
}

// * Makes and returns functional buttons for each task 'li' element
function makeButtons(task: Task, editPlaceholder: HTMLFormElement): HTMLDivElement {
  const editButton = document.createElement("button")
  editButton.innerHTML = '<img src="edit.png" alt="" id="edit">';
  editButton.addEventListener("click", () => editTask(task, editPlaceholder));

  const delButton = document.createElement("button");
  delButton.innerHTML = '<img src="delete.png" alt="" id="garbage">';
  delButton.addEventListener("click", () => deleteTask(task));

  const upButton = document.createElement("button");
  upButton.innerHTML = '<img src="up.png" alt="" id="up-button">';
  upButton.addEventListener("click", () => moveUp(task));

  const downButton = document.createElement("button");
  downButton.innerHTML = '<img src="down.png" alt="" id="down-button">';
  downButton.addEventListener("click", () => moveDown(task));

  const buttonsContainer = document.createElement("div");
  buttonsContainer.setAttribute("id", "buttons-container");
  buttonsContainer.appendChild(upButton);
  buttonsContainer.appendChild(downButton);
  buttonsContainer.appendChild(editButton);
  buttonsContainer.appendChild(delButton);

  return buttonsContainer;
}

// * UI loader upon HTML load
window.addEventListener('load', initUI);