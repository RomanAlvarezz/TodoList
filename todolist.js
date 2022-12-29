let todos;

window.addEventListener('load', () => {
    todos = JSON.parse(localStorage.getItem('todos')) || [];
    const nameInput = document.querySelector('#name');
    const newTodoForm = document.querySelector('#new-todo-form');

    const username = localStorage.getItem('username') || '';

    nameInput.value = username;

    nameInput.addEventListener('change', e => {
        localStorage.setItem('username', e.target.value)
    })

    newTodoForm.addEventListener('submit', e => {
        e.preventDefault();

        const todo = {
            content: e.target.elements.content.value.trim(),
            category: e.target.elements.category.value,
            done: false,
            createdAt: new Date().getTime()
        }

        if( !todo.content || !todo.category){
            showError();
            return;
        }

        todos.push(todo);

        localStorage.setItem('todos', JSON.stringify(todos)); 

        e.target.reset();

        DisplayTodos();
    })

    DisplayTodos();
    asignEvents();
})

function DisplayTodos(){
    const $todoList = document.querySelector('#todo-list');
    const $template = document.getElementById('template').content;
    const $fragment = document.createDocumentFragment();

    $todoList.innerHTML = '';

    todos.forEach(todo => {
        const $checkbox = $template.querySelector('input[type="checkbox"]');
        const $span = $template.querySelector('span');
        const $input = $template.querySelector('input[type="text"]');
        const $todoItem = $template.querySelector('.todo-item');
        $span.className = 'bubble';

        $checkbox.checked = todo.done;

        if (todo.category == 'personal'){
            $span.classList.add('personal');
        } else {
            $span.classList.add('business');
        }

        $input.setAttribute('value', todo.content);

        $span.setAttribute('task-id', todo.createdAt);

        if(todo.done){
            $todoItem.classList.add('done');
        } else {
            $todoItem.classList.remove('done');
        }

        const clone = $template.cloneNode(true);

        $fragment.appendChild(clone)
    })

    $todoList.appendChild($fragment);
}

function showError(){
    const $todoList = document.querySelector('#todo-list');
    const $errorMsg = document.createElement('p');
    $errorMsg.innerHTML = 'Tasks without content or category are not accepted';
    $errorMsg.classList.add('error');
    $todoList.appendChild($errorMsg);

    setTimeout(()=>{
        $errorMsg.remove();
    }, 2000);

}

function asignEvents(){
    document.addEventListener('change', e => {
        if(e.target.matches('.todo-item input[type="checkbox"]')){
            let $todoItem = e.target.parentElement.parentElement;
            let taskId = e.target.nextElementSibling.getAttribute('task-id');

            const objIndex = todos.findIndex((obj)=> obj.createdAt == taskId);
            todos[objIndex].done = e.target.checked;
            localStorage.setItem('todos', JSON.stringify(todos));

            if(e.target.checked) {
                $todoItem.classList.add('done');
            } else {
                $todoItem.classList.remove('done');
            }
        }
    })

    document.addEventListener('click', e => {
        if(e.target.matches('.delete')){
            let $todoItem = e.target.parentElement.parentElement;
            let taskId = $todoItem.querySelector('span').getAttribute('task-id');

            todos = todos.filter(t => t.createdAt != taskId);
            localStorage.setItem('todos', JSON.stringify(todos));

            DisplayTodos();
        }

        if(e.target.matches('.edit')){
            let $todoItem = e.target.parentElement.parentElement;
            let $input = $todoItem.querySelector('input[type="text"]');
            let taskId = $todoItem.querySelector('span').getAttribute('task-id');

            $input.removeAttribute('readonly');
            $input.focus();

            $input.addEventListener('blur', e => {
                $input.setAttribute('readonly', true);

                const objIndex = todos.findIndex((obj)=> obj.createdAt == taskId);
                todos[objIndex].content = e.target.value;

                localStorage.setItem('todos', JSON.stringify(todos));
                DisplayTodos();
            })
        }
    });

}
