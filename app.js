document.addEventListener("DOMContentLoaded", async function () {
    const insertTodo = document.getElementById('enter-todo');
    const todosList = document.getElementById('todos');
    const itemsLeft = document.getElementById('items-left');
    const filters = document.querySelectorAll('.filters h3');
    const clearCompleted = document.querySelector('.clear h3');
    
    let todosData = await fetch('/todos.json').then(response => response.json());
    let currentFilter = 'all';
  
    // Function to update the JSON file with the current todosData
    const updateJSONFile = async () => {
      await fetch('/todos.json', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todosData),
      });
    };
  
    // Function to display the to-dos
    const displayTodos = () => {
      todosList.innerHTML = '';
      const filteredTodos = todosData.todos.filter(todo => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
      });
  
      itemsLeft.textContent = todosData.todos.filter(todo => !todo.completed).length;
  
      filteredTodos.forEach((todoItem, index) => {
        const todo = document.createElement('div');
        todo.classList.add('todo');
    
        const checkBox = document.createElement('div');
        checkBox.classList.add('checkbox');
        if (todoItem.completed) {
            checkBox.classList.add('checked');
        }
        todo.appendChild(checkBox);

        checkBox.addEventListener('click', () => {
            todoItem.completed = !todoItem.completed;
            if (todoItem.completed) {
            checkBox.classList.add('checked');
            } else {
            checkBox.classList.remove('checked');
            }

            updateJSONFile();
            displayTodos();
        });
  
        const checkMark = document.createElement('img');
        checkMark.src = todoItem.completed ? './images/icon-check.svg' : '';
        checkBox.appendChild(checkMark);
    
        const todoContent = document.createElement('h2');
        todoContent.textContent = todoItem.name;
        todo.appendChild(todoContent);
    
        const deleteIcon = document.createElement('img');
        deleteIcon.src = 'images/icon-cross.svg';
        deleteIcon.addEventListener('click', () => {
          todosData.todos.splice(index, 1);
          updateJSONFile();
          displayTodos();
        });
        todo.appendChild(deleteIcon);
    
        todosList.appendChild(todo);
      });
    };
  
    displayTodos();
  
    // Handle form submission
    document.getElementById('add-todo').addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent the form from submitting
      const newTodoName = insertTodo.value.trim();
      if (newTodoName !== "") {
        todosData.todos.push({
          name: newTodoName,
          completed: false
        });
        updateJSONFile();
        displayTodos();
        insertTodo.value = ""; // Clear the input field
      }
    });
  
    // Handle filter selection
    filters.forEach(filter => {
      filter.addEventListener('click', () => {
        currentFilter = filter.textContent.toLowerCase();
        displayTodos();
      });
    });
  
    // Handle "Clear Completed" action
    clearCompleted.addEventListener('click', () => {
      todosData.todos = todosData.todos.filter(todo => !todo.completed);
      updateJSONFile();
      displayTodos();
    });
  });
