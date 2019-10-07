const main = document.getElementById('ToDoList');
let todoList = [];
openModal();
load();

function openModal() {
    let addModal = document.getElementById("addModal"),
        addBtn = document.getElementById("addBtn"),
        addCancel = document.getElementById("addCancel"),
        addClose = document.getElementById("addClose");

    addBtn.onclick = function () {
        addModal.style.display = "block";
    };

    addCancel.onclick = function () {
        addModal.style.display = "none";
    };

    addClose.onclick = function () {
        addModal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target == addModal) {
            addModal.style.display = "none";
        }
        if (event.target == editModal) {
            editModal.style.display = "none";
        }
    };

    let editModal = document.getElementById("editModal"),
    editCancel = document.getElementById("editCancel"),
    editClose = document.getElementById("editClose");

    editClose.onclick = function () {
        editModal.style.display = "none";
    };

    editCancel.onclick = function () {
        editModal.style.display = "none";
    };
}

function load() {
    if (localStorage.getItem('todo') != undefined) {
        todoList = JSON.parse(localStorage.getItem('todo'));
        addTask();
    }
    if (todoList == null) {
        sortTask();
    }

}

function saveData(name, description, priority, deadline, id) {
    let temp = {};

    localStorage.setItem('name', name.value);
    localStorage.setItem('description', description.value);
    localStorage.setItem('priority', priority.value);
    localStorage.setItem('deadline', deadline.value);
    localStorage.setItem('id', id);

    let saveName = localStorage.getItem('name'),
        saveDescription = localStorage.getItem('description'),
        savePriority = localStorage.getItem('priority'),
        saveDeadline = localStorage.getItem('deadline');

    temp.check = false;
    temp.name = saveName;
    temp.description = saveDescription;
    temp.priority = savePriority;
    temp.deadline = saveDeadline;
    temp.id = id;

    todoList[id] = temp;

    addTask();
    saveList(todoList);
    load();
}

function saveList(todoList) {
    localStorage.setItem('todo', JSON.stringify(todoList));
}

function getList() {
    return JSON.parse(localStorage.getItem('todo'));
}

// Add => сосчитать форму в локал стор и отправить в список
function submitTask() {

    let name = document.getElementById('name'),
        description = document.getElementById('description'),
        priority = document.getElementById('priority'),
        deadline = document.getElementById('deadline');

    saveData(name, description, priority, deadline, todoList.length);
    sortTask();
}

function addTask() {
    let out = '';
    for (let key in todoList) {
        out += `
        <ul id="item-${todoList[key].id}" class="ToDoEl ${(todoList[key].check == true) ? 'checked' : ''}">
            <li class="Name">${todoList[key].name}</li>
            <li class="Description">${todoList[key].description}</li>
            <li class="${todoList[key].priority == 'low' ? 'low' : todoList[key].priority == 'middle' ? 'middle' : 'hight'}">${todoList[key].priority}</li>
            <li>${todoList[key].deadline}</li>
            <button class="delete" onclick="deleteTask(${todoList[key].id})">Delete</button>
            <button class="edit" onclick="editTask(${todoList[key].id})">Edit</button>
            <button class="done" onclick="doneTask(${todoList[key].id})">Done</button>
            <i class="fas fa-check-circle"></i>
        </ul>
        `;
    }
    main.innerHTML = out;
}

// delete => удалить елемент
function deleteTask(id) {
    let todoList = getList().filter((item) => (item.id !== id));
    saveList(todoList);
    load();
}

// edit => править task
function editTask(id) {
    editModal.style.display = "block";

    const todoList = getList(),
        todo = todoList.find((item) => (item.id === id));

    document.querySelector('#editName').value = todo.name;
    document.querySelector('#editDescription').value = todo.description;
    document.querySelector('#editPriority').value = todo.priority;
    document.querySelector('#editDeadline').value = todo.deadline;

    document.querySelector('#editModal').onsubmit = () => {
        submitEditTask(id);
    };
}

function submitEditTask(id) {
    let name = document.getElementById('editName'),
        description = document.getElementById('editDescription'),
        priority = document.getElementById('editPriority'),
        deadline = document.getElementById('editDeadline');

    saveData(name, description, priority, deadline, id);
}

// done => отметить как сделанное
function doneTask(id) {
    let todoList = getList();
    const todo = todoList.find((item) => (item.id === id));

    if (todo.check) {
        todo.check = false;
    } else {
        todo.check = true;
    }

    sortTask();
    saveList(todoList);
    load();
}

// sort
function sortTask() {
    const todoList = getList();
    todoList.sort((a, b) => a.check - b.check);
    addTask();
    saveList(todoList);
    load();
}