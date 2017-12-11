const electron = require('electron');
const url = require('url');
const path = require('path');
var dialog = electron.dialog;
var fs = require('fs');
//error checking
//console.log(require.resolve('electron'));

const { app } = require('electron');
const {BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

//Listen for app to be ready
app.on('ready', function(){
//create new window
    mainWindow = new BrowserWindow({});
//Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    });

    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    //Insert Menu
    Menu.setApplicationMenu(mainMenu);
});

//Adding in new task screen
function addNewTask(){
    //create new window
    addWindow = new BrowserWindow({
        width: 400,
        height: 300,
        title:'Add New Task'
    });
    //Load html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'add.html'),
        protocol: 'file:',
        slashes: true
    }));  
    
    //Frees up memory when new window is closed
    addWindow.on('close', function(){
        addWindow = null;
    });
};

//Catch task:add
ipcMain.on('task:add', function(e, task){
    mainWindow.webContents.send('task:add', task);
    addWindow.close();
});

//Save file
    function saveFile() {
        dialog.showSaveDialog((filename) => {
            if (filename === undefined) {
                alert("You didn't enter in a file name!");
                return;
            };

            var content = document.getElementById('ulList').value;

            fs.writeFile(filename, content, (err)=>{
                if (err) console.log(err)
                alert("the file has been saved successfully!")
            });

        });

    };

//Opening a file
function openFile(){
    dialog.showOpenDialog((filenames) =>{
        if(filenames === undefined){
            alert('no files were selected');
            return;
        };
        readFile(filenames[0]);
    });
}; 

function readFile(filepath){
    fs.readFile(filepath, 'utf-8', (err, data)=>{
        if(err){
            alert('There was an error retreving your file');
        };
        const li = document.createElement('li');
        const dataText = document.createTextNode(data);
        li.appendChild(data);
        ul.appendChild(li);
        var textArea = document.getElementsByTagName('li');
        textArea.value = data;
    });
};

//Creating a Menu Template
const menuTemplate = [
    {
        label: 'File',
        submenu:[
            {
                label: 'Add Task',
                accelerator: process.platform == 'darwin' ? 'Command+N' : 'Ctrl+N',
                click(){
                    addNewTask();
                }
            },
            {
                label: 'Open',
                accelerator: process.platform == 'darwin' ? 'Command+O' : 'Ctrl+O',
                click() {
                    openFile();
                }
            },
            {
                label: 'Clear All Tasks',
                click(){
                    mainWindow.webContents.send('task:clear');
                }  
            },
            {
                label: 'Save',
                accelerator: process.platform == 'darwin' ? 'Command+S' : 'Ctrl+S',
                click() {
                    saveFile();
                }
            },    
            {
                label: 'Exit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q', 
                click(){
                    app.quit();
                }
            }
        ],      
       
    },

    {
        label: 'Edit',
    },

    {
        label: 'Dev Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ],
    }
    
];

