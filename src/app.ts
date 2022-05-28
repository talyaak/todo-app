// console.log("hi baby girl 123")

type Task = {
  title: string
  completed: boolean
}

const garbageIcon = document.createElement("img");
garbageIcon.setAttribute("src", "delete.png")

const taskList = document.getElementById("list") as HTMLUListElement;
const form = document.getElementById("new-task-form") as HTMLFormElement;
const input = document.getElementById("new-task-title") as HTMLInputElement;
const clear = document.getElementById("clear") as HTMLButtonElement;
const pendingTasks = document.getElementById("pending-tasks") as HTMLDivElement;
let tasks: Task[] = loadTasks(); // * using localStorage to load tasks (if they exist)

pendingTasks.innerText = "You have 0 pending tasks"

taskArrange();
tasks.forEach(addListItem);

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
  // tasks.push(newTask); // * New task added, list updated
  saveTasks(); // * localStorage is also updated
  location.reload();
  // addListItem(newTask); // * adds the input to task list
  // input.value = ""; // * resets text bar

})

clear.addEventListener("click", () => {
  console.log("pressed");
  localStorage.removeItem("TASKS");
  location.reload();

})

function addListItem(task: Task): void {
  const item = document.createElement("li");
  const label = document.createElement("label");
  const checkbox = document.createElement("input");

  const editButton = document.createElement("button")
  editButton.innerHTML = '<img src="edit.png" alt="" id="edit">';
  editButton.addEventListener("click", () => editTask(task));

  const delButton = document.createElement("button");
  delButton.innerHTML = '<img src="delete.png" alt="" id="garbage">';
  delButton.addEventListener("click", () => deleteTask(task));

  const buttonsContainer = document.createElement("div");
  buttonsContainer.setAttribute("id","buttons-container");
  buttonsContainer.appendChild(editButton);
  buttonsContainer.appendChild(delButton);

  // * each task 'tick' will cause this
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked; // * task modified
    saveTasks(); // * task is changed, mandatory update!
    location.reload();
  })

  checkbox.type = "checkbox";
  checkbox.checked = task.completed;

  label.append(checkbox, task.title);
  if (task.completed) { // * adding strike if task done (upon refresh)
    const s = document.createElement("s");
    s.append(label);
    item.append(s, buttonsContainer);
  }
  else { item.append(label, buttonsContainer); }

  taskList?.append(item); // * '?' to prevent error when taskList == null

  taskCount();

}

function saveTasks(): void {
  localStorage.setItem("TASKS", JSON.stringify(tasks));
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem("TASKS");
  if (taskJSON === null) return []; // * If there are no tasks
  return JSON.parse(taskJSON); // * At least one task
}

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
  location.reload(); // * Refreshing UI
}

// * Prompts an "edit task" window and updates it
function editTask(task: Task): void {
  let updatedTask: string|null = prompt("Edit task", "enter here...");
  if (typeof updatedTask === 'string' 
    && updatedTask.trim().length !== 0
    && updatedTask !== "enter here...") {
    task.title = updatedTask;
  }
  else alert("did not enter a task");
  saveTasks();
  location.reload();
  
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