const newListInput = document.getElementById('newListInput'); // input field to enter list name
const addListButton = document.getElementById('addListBtn') // Add list button
const deleteListButton = document.getElementById('deleteListBtn') // Delete list button
const listsContainer = document.getElementById('listsContainer'); // list of to-do lists
const listTitle = document.getElementById('listTitle'); //list name in main content section
const taskInputSection = document.getElementById('taskInputSection');
const newTaskInput = document.getElementById('newTaskInput'); // input field to enter tasks
const addTaskButton = document.getElementById('addTaskBtn') //Add task button
const taskList = document.getElementById('taskList'); // list of tasks

let listsAndTasksArr = []   //array to store all lists and its tasks in local storage
let regExp = /^\s*$/   //regExp to exclude empty input fields

function addList(){
    let listName = newListInput.value
    if (regExp.test(listName)){
        inputField = ''
        return
    }
    createListHTML(listName)
    let listAndTasksObj = {
        list: listName,
        tasks: [],
    }
    listsAndTasksArr.push(listAndTasksObj)
    newListInput.value = ''
    saveToLocalStorage()
}

function createListHTML(listName){
        let newList = document.createElement('div')
        newList.className = 'list-item'
        newList.innerHTML = listName
        listsContainer.append(newList)
}

function removeList(){
    let activeList = document.getElementsByClassName('list-item active')[0]
    activeList.remove()
    listTitle.innerHTML = 'Select a list'
    taskInputSection.style = "display:none"
    taskList.style = "display:none"
    listsAndTasksArr = listsAndTasksArr.filter(elem => elem.list != activeList.textContent)
    saveToLocalStorage()
}

function selectList(event){
    event.preventDefault()
    let activeLists = document.getElementsByClassName('list-item active')
    for(let list of activeLists){
        list.className = 'list-item'
    }
    event.target.className = 'list-item active'
    taskInputSection.style = "display:yes"
    taskList.style = "display:yes"
    listTitle.innerHTML = event.target.innerText
    renderTasks()
    saveToLocalStorage()
} 

function addTask(){
    if (regExp.test(newTaskInput.value)){
        inputField = ''
        return
    }
    let selectedList = document.getElementsByClassName('list-item active')[0].innerHTML
    for(let el of listsAndTasksArr){
        if(el.list == selectedList){
                el.tasks.push({taskName: newTaskInput.value,
                                completed: false
                })
            }
    }
    renderTasks()
    newTaskInput.value = ''
    saveToLocalStorage()
}

function createTaskHTML(taskObj){
        let newTask = document.createElement('li')
        if(taskObj.completed){
            newTask.className = 'task-text completed'
        } else{
            newTask.className = 'task-text'
        }
        newTask.innerHTML = taskObj.taskName
        taskList.append(newTask)
        const delButton = document.createElement('button')
        delButton.textContent = 'X';
        newTask.append(delButton)
}

function renderTasks() {
    taskList.innerHTML = '';
    let selectedList = document.getElementsByClassName('list-item active')[0].innerHTML
    let toBeDisplayedTasksArr;
    for(let el of listsAndTasksArr){
        if(el.list == selectedList){
            toBeDisplayedTasksArr = el.tasks
        }
    }
    for(let task of toBeDisplayedTasksArr){
        createTaskHTML(task)
    }
}

function removeTask(event){
    if(event.target.tagName == 'BUTTON'){
        event.target.parentElement.remove()
        updateTasksList()
        saveToLocalStorage()
    }
}

function markAsDone(event){
    if(event.target.tagName == 'LI'){
        event.target.classList.toggle('completed')
    } else if( event.target.tagName === 'INPUT'){
        event.target.parentElement.classList.toggle('completed')
    }
    updateTasksList()
    saveToLocalStorage()
}

function updateTasksList(){
    let currentTasksArr = document.getElementsByClassName('task-text')
    let updatedTasksArr = []
    for(let task of currentTasksArr){
        if(task.className == 'task-text completed'){
            updatedTasksArr.push({taskName: task.textContent.slice(0, -1),
                                    completed: true
            })
        } else{
            updatedTasksArr.push({taskName: task.textContent.slice(0, -1),
                                    completed: false
            })
        }
    }
    let selectedList = document.getElementsByClassName('list-item active')[0].innerHTML
    for(let el of listsAndTasksArr){
        if(el.list == selectedList){
            el.tasks = updatedTasksArr
        }
    }
}

function saveToLocalStorage() {
    localStorage.setItem('listsAndTasks', JSON.stringify(listsAndTasksArr))
}

function showDataFromLocalStorage() {
    let listsAndTasks = JSON.parse(localStorage.getItem('listsAndTasks'))
    if(!listsAndTasks){
        return []
    }
    for(let el of listsAndTasks){
        createListHTML(el.list)
    }
    return listsAndTasks
}

addListButton.addEventListener('click', addList)
listsContainer.addEventListener('click', selectList)
addTaskButton.addEventListener('click', addTask)
taskList.addEventListener('click', removeTask)
taskList.addEventListener('click', markAsDone)
deleteListButton.addEventListener('click', removeList)
listsAndTasksArr = showDataFromLocalStorage()
