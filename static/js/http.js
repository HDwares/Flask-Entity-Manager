function get_all_tasks() {
    fetch("/get_all")
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.log(error))
}

function add_task() {
    const content_input = document.getElementById("content");
    if (content_input.value === "") {
        document.getElementById("info-lbl").innerText = "Please enter a task";
    }
    else {
        fetch('/add', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({"content": content_input.value})
        })
            .then(response => response.text())
            .then(data => {
                content_input.value = "";
                display_msg_and_reload(data)
            })
            .catch(error => console.log(error))
    }
}

function display_msg_and_reload(msg) {
    document.getElementById("info-lbl").innerText = msg;
    reload_tasks();
}

function reload_tasks() {
    const tasks_container = document.getElementById('tasks')
    tasks_container.innerHTML = ``;
    fetch('/get_all')
        .then(response => response.text())
        .then(tasks => {
            tasks = JSON.parse(tasks)['tasks'];
            if (tasks.length >= 1) {
                document.getElementById("tasks-tbl").style.display = "block";
                for (let i = 0; i < tasks.length; i++) {
                    task = tasks[i];
                    tasks_container.innerHTML += `<tr>
            <td>${task.content}</td>
            <td>${(new Date(task.date_created)).toDateString()}</td>
            <td>
                <a href="#" onclick="delete_task(${task.id})">Delete</a>
                <a href="#" onclick="edit_task(${task.id}, '${task.content}')">Update</a>
            </td>
        </tr>`
                }
            }
            else {
                document.getElementById("tasks-tbl").style.display = "none";
                document.getElementById("info-lbl").innerText = "No task to display";
            }
        })
        .catch(error => console.log(error))
}

function delete_task(id) {
    fetch(`/delete/${id}`, {
        method: 'DELETE'
    })
        .then(response => response.text())
        .then(data => display_msg_and_reload(data))
        .catch(error => console.log(error))
}

function edit_task(id, content) {
    document.getElementById("add-task-btn").remove();
    document.getElementById("add-task-form").innerHTML += 
    `<button class="add-update-btn" 
    onclick="update_task()" id="update-task-btn" 
    >Update Task</button>`;
    content_input = document.getElementById("content");
    content_input.value = content;
    content_input.setAttribute("data-task-id", id);
}

function update_task() {
    const content_input = document.getElementById("content");
    const content = content_input.value;
    const id = content_input.getAttribute("data-task-id");
    fetch('/update', {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({"id": id, "content": content})
    })
        .then(response => response.text())
        .then(data => {
            content_input.value = "";
            display_msg_and_reload(data);
            document.getElementById("update-task-btn").remove();
            document.getElementById("add-task-form").innerHTML += 
            `<button class="add-update-btn" 
            onclick="add_task()" id="add-task-btn" 
            >Add Task</button>`;
        })
        .catch(error => console.log(error))
}