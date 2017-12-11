const electron = require('electron');
const {ipcRenderer} =  electron;
const ul = document.querySelector('ul');
var dialog = electron.dialog;
var fs = require('fs');

    //Adding a Task
    ipcRenderer.on('task:add', function(e, task){
        const li = document.createElement('li');
        const taskText = document.createTextNode(task);
        li.appendChild(taskText);
        ul.appendChild(li);
        });

    //Clear Task
    ipcRenderer.on('task:clear', function () {
        ul.innerHTML = '';
    });

    //Remove a single task
    ul.addEventListener('dblclick', removeTask);

    function removeTask(e){
        e.target.remove();
    };

    
