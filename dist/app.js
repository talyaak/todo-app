var app =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	"use strict";
	// console.log("hi baby girl 123")
	const garbageIcon = document.createElement("img");
	garbageIcon.setAttribute("src", "delete.png");
	const taskList = document.getElementById("list");
	const form = document.getElementById("new-task-form");
	const input = document.getElementById("new-task-title");
	const clear = document.getElementById("clear");
	const pendingTasks = document.getElementById("pending-tasks");
	let tasks = loadTasks(); // * using localStorage to load tasks (if they exist)
	pendingTasks.innerText = "You have 0 pending tasks";
	tasks.forEach(addListItem);
	form === null || form === void 0 ? void 0 : form.addEventListener("submit", e => {
	    e.preventDefault(); // * preventing page refresh
	    let text = input === null || input === void 0 ? void 0 : input.value;
	    if (text === "" || text === null)
	        return; // * no text input (nothing happens)
	    if (text.trim().length === 0) { // * Only space input (not a task)
	        input.value = ""; // * reset text bar
	        return;
	    }
	    // * next code: text has been submitted, task is created
	    const newTask = {
	        title: input.value,
	        completed: false
	    };
	    tasks.push(newTask); // * New task added, list updated
	    saveTasks(); // * localStorage is also updated
	    addListItem(newTask); // * adds the input to task list
	    input.value = ""; // * resets text bar
	});
	clear.addEventListener("click", () => {
	    console.log("pressed");
	    localStorage.removeItem("TASKS");
	    location.reload();
	});
	function addListItem(task) {
	    const item = document.createElement("li");
	    const label = document.createElement("label");
	    const checkbox = document.createElement("input");
	    const delButton = document.createElement("button");
	    delButton.innerHTML = '<img src="delete.png" alt="" id="garbage">';
	    delButton.addEventListener("click", () => deleteTask(task));
	    // * each task 'tick' will cause this
	    checkbox.addEventListener("change", () => {
	        task.completed = checkbox.checked; // * task modified
	        saveTasks(); // * task is changed, mandatory update!
	        location.reload();
	    });
	    checkbox.type = "checkbox";
	    checkbox.checked = task.completed;
	    label.append(checkbox, task.title);
	    if (task.completed) { // * adding strike if task done (upon refresh)
	        const s = document.createElement("s");
	        s.append(label);
	        item.append(s, delButton);
	    }
	    else {
	        item.append(label, delButton);
	    }
	    taskList === null || taskList === void 0 ? void 0 : taskList.append(item); // * '?' to prevent error when taskList == null
	    taskCount();
	}
	function saveTasks() {
	    localStorage.setItem("TASKS", JSON.stringify(tasks));
	}
	function loadTasks() {
	    const taskJSON = localStorage.getItem("TASKS");
	    if (taskJSON === null)
	        return []; // * If there are no tasks
	    return JSON.parse(taskJSON); // * At least one task
	}
	function deleteTask(task) {
	    console.log("del clicked");
	    let count = 0;
	    for (let instance of tasks) {
	        if (instance === task) {
	            break;
	        }
	        else
	            count++;
	    }
	    tasks.splice(count, 1); // * deleting the task from list
	    saveTasks(); // * Applying to localStorage
	    location.reload(); // * Refreshing UI
	}
	function taskCount() {
	    let completed = 0;
	    for (let task of tasks) {
	        if (task.completed) {
	            completed++;
	        }
	    }
	    let uncompletedTasks = tasks.length - completed;
	    if (uncompletedTasks > 1 || uncompletedTasks === 0) {
	        pendingTasks.innerText = "You have " + uncompletedTasks + " pending tasks";
	    }
	    else {
	        pendingTasks.innerText = "You have 1 pending task";
	    }
	}


/***/ })
/******/ ]);