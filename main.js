const { app, BrowserWindow, Notification } = require('electron');
const path = require('path');
const { startWatching } = require('electron-notification-state');

let mainWindow;
let tasks = [];

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Opcional: Abre las herramientas de desarrollador en la ventana
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
  startWatching();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Función para mostrar una notificación con sonido
function showNotificationWithSound(taskText) {
  const notification = new Notification({
    title: 'Recordatorio de tarea',
    body: taskText,
    sound: path.join(__dirname, 'windows-10.mp3'), // Reemplaza "path/to/notification-sound.mp3" con la ruta de tu archivo de sonido de notificación
  });

  notification.show();
}
function addTask() {
  const taskText = taskInput.val();
  if (taskText.trim() === '' || timeInput.val() === '' || dateInput.val() === '') return;

  const taskDateTime = new Date(`${dateInput.val()} ${timeInput.val()}`);
  const task = {
    text: taskText,
    date: taskDateTime.getTime(),
  };

  tasks.push(task);
  taskInput.val('');
  timeInput.val('');
  dateInput.val('');

  // Ordenar las tareas por fecha y hora (más reciente primero)
  tasks.sort((a, b) => b.date - a.date);

  updateTaskList();
}

// Función para actualizar la lista de tareas en el DOM
function updateTaskList() {
  taskList.empty();

  tasks.forEach((task, index) => {
    const hue = (index * 20) % 360;
    const listItem = $('<li>').html(`
      <span>${task.text}</span>
      <span>${new Date(task.date).toLocaleString()}</span>
      <i class="fas fa-trash-alt delete" data-index="${index}"></i>
    `);
    listItem.css('background-color', `hsl(${hue}, 80%, 80%)`);
    taskList.append(listItem);

    // Verificar si la tarea está a menos de 15 minutos del horario seleccionado
    const currentTime = new Date().getTime();
    if (task.date - currentTime <= 15 * 60 * 1000) {
      showNotificationWithSound(task.text); // Llamada a la función para mostrar la notificación con sonido
    }
  });
}

function exampleShowNotification() {
  const taskText = 'Tarea de ejemplo';
  showNotificationWithSound(taskText);
}
