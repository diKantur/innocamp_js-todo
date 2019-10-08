const main = document.getElementById('ToDoList');
let todoList = [];
openModal();
load();

function openModal() {
    let addModal = document.getElementById("addModal"),
        addBtn = document.getElementById("addBtn"),
        addCancel = document.getElementById("addCancel"),
        addClose = document.getElementById("addClose");

    let editModal = document.getElementById("editModal"),
        editCancel = document.getElementById("editCancel"),
        editClose = document.getElementById("editClose");

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

    editClose.onclick = function () {
        editModal.style.display = "none";
    };

    editCancel.onclick = function () {
        editModal.style.display = "none";
    };
}

function load() {
    if (localStorage.getItem('todo') != undefined) {
        todoList = getList();
        addTask(todoList);
    }
}

function saveTask(name, description, priority, deadline, id) {

    localStorage.setItem('name', name.value);
    localStorage.setItem('description', description.value);
    localStorage.setItem('priority', priority.value);
    localStorage.setItem('deadline', deadline.value);
    localStorage.setItem('id', id);

    let saveName = localStorage.getItem('name'),
        saveDescription = localStorage.getItem('description'),
        savePriority = localStorage.getItem('priority'),
        saveDeadline = localStorage.getItem('deadline'),
        temp = {};

    temp.check = false;
    temp.name = saveName;
    temp.description = saveDescription;
    temp.priority = savePriority;
    temp.deadline = saveDeadline;
    temp.id = id;

    todoList[id] = temp;

    sortTask();
}

function saveList() {
    localStorage.setItem('todo', JSON.stringify(todoList));
    load();
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

    saveTask(name, description, priority, deadline, todoList.length);
}

function addTask(todoList) {
    let taskList = '';
    for (let key in todoList) {
        taskList += `
        <ul id="item-${todoList[key].id}" class="ToDoEl ${(todoList[key].check == true) ? 'checked' : ''}">
            <li class="Name">${todoList[key].name}</li>
            <li class="Description">${todoList[key].description}</li>
            <li class="${todoList[key].priority == 'low' ? 'low' : todoList[key].priority == 'middle' ? 'middle' : 'high'}">${todoList[key].priority}</li>
            <li>${todoList[key].deadline}</li>
            <button class="delete" onclick="deleteTask(${todoList[key].id})">Delete</button>
            <button class="edit" onclick="editTask(${todoList[key].id})">Edit</button>
            <button class="done" onclick="doneTask(${todoList[key].id})">Done</button>
            <i class="fas fa-check-circle"></i>
        </ul>
        `;
    }
    main.innerHTML = taskList;
}

// delete => удалить елемент
function deleteTask(id) {
    todoList = todoList.filter((item) => (item.id !== id));
    saveList();
}

// edit => править task
function editTask(id) {
    editModal.style.display = "block";

    const todo = todoList.find((item) => (item.id === id));
    console.log(id);


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

    saveTask(name, description, priority, deadline, id);
}

// done => отметить как сделанное
function doneTask(id) {
    const todo = todoList.find((item) => (item.id === id));

    if (todo.check) {
        todo.check = false;
    } else {
        todo.check = true;
    }

    sortTask();
}

// sort boolean + by priority
function sortTask() {
    let trueList = todoList.filter(item => item.check),
        falseList = todoList.filter(item => !item.check),
        filter = new Map();
    filter.set('low', 1);
    filter.set('middle', 2);
    filter.set('high', 3);

    trueList.sort((a, b) => {
        return filter.get(a.priority) - filter.get(b.priority);
    });
    falseList = falseList.sort((a, b) => {
        return filter.get(a.priority) - filter.get(b.priority);
    });

    todoList = falseList.concat(trueList);
    todoList.map((value, index) => value.id = index);
    saveList();
}

//search by text
function searchText() {
    main.innerHTML = '';
    let todoList = getList();
    const val = document.getElementById('search').value.toLowerCase();
    todoList = todoList.filter(item => (item.name.includes(val) || item.description.includes(val)));

    addTask(todoList);
}