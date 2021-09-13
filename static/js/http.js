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
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `content=${content_input.value}`
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
                <a href="/update/${task.id}">Update</a>
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