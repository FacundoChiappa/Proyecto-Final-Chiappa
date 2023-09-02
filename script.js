$(document).ready(function () {
    // Arreglo para almacenar las tareas
    let tasks = [];
  
    // Obtener elementos del DOM
    const taskInput = $("#task");
    const taskList = $("#taskList");
    const timeInput = $("#time");
    const dateInput = $("#date");
  
    // Configurar Flatpickr para el selector de horario
    flatpickr(timeInput[0], {
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i",
    });
  
    // Configurar Flatpickr para el selector de fecha
    flatpickr(dateInput[0], {
      dateFormat: "Y-m-d",
    });
  
    // Función para agregar una nueva tarea
    function addTask() {
      const taskText = taskInput.val();
      if (taskText.trim() === "" || timeInput.val() === "" || dateInput.val() === "") return;
  
      const taskDateTime = new Date(`${dateInput.val()} ${timeInput.val()}`);
      const task = {
        text: taskText,
        date: taskDateTime.getTime(),
      };
  
      tasks.push(task);
      taskInput.val("");
      timeInput.val("");
      dateInput.val("");
  
      // Ordenar las tareas por fecha y hora (más reciente primero)
      tasks.sort((a, b) => b.date - a.date);
  
      updateTaskList();
    }
  
    // Función para mostrar la notificación emergente y reproducir el sonido
    function showNotification(taskText) {
      const notifier = require('node-notifier');
      notifier.notify({
        title: 'Recordatorio de tarea',
        message: taskText,
        sound: true,
      });
    }
  
    // Función para actualizar la lista de tareas en el DOM
    function updateTaskList() {
      taskList.empty();
  
      tasks.forEach((task, index) => {
        const hue = (index * 20) % 360;
        const listItem = $("<li>").html(`
          <span>${task.text}</span>
          <span>${new Date(task.date).toLocaleString()}</span>
          <i class="fas fa-trash-alt delete" data-index="${index}"></i>
        `);
        listItem.css("background-color", `hsl(${hue}, 80%, 80%)`);
        taskList.append(listItem);
  
        // Verificar si la tarea está a menos de 15 minutos del horario seleccionado
        const currentTime = new Date().getTime();
        if (task.date - currentTime <= 15 * 60 * 1000) {
          showNotification(task.text);
        }
      });
    }
  
    // Función para eliminar una tarea
    function deleteTask(index) {
      tasks.splice(index, 1);
      updateTaskList();
    }
  
    // Evento para agregar una nueva tarea al hacer clic en el botón
    $("#addBtn").on("click", addTask);
  
    // Evento para agregar una nueva tarea al presionar Enter en el input
    taskInput.on("keypress", function (e) {
      if (e.which === 13) {
        addTask();
      }
    });
  
    // Evento para eliminar una tarea al hacer clic en el icono de eliminar
    $(document).on("click", ".delete", function () {
      const index = $(this).data("index");
      deleteTask(index);
    });
  
    // Cambiar el color de fondo de los ítems de la lista al cargar la página
    updateTaskList();
  });
  