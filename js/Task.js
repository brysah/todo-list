export class Task {
    constructor(root) {
        this.root = document.querySelector(root);
        this.load();
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('task')) || [];
    }

    save() {
        localStorage.setItem('task', JSON.stringify(this.entries));
    }

    countCheck() {
        let total = this.entries.reduce(function (ac, curr) {
            if (curr.isChecked) ac++;
            return ac;
        }, 0);
        return total;
    }

    updateIsChecked(entry) { 
        if (this.entries.find(item => item.value === entry.value).isChecked) {
            this.entries.find(item => item.value === entry.value).isChecked = false
        }
        else this.entries.find(item => item.value === entry.value).isChecked = true;
        this.save();
    }

    add(task) {
        try {
            const taskExists = this.entries.find(entry => entry.value === task.value);
            if (taskExists) {
                throw new Error('Task already exist');
            }
            if (task.value.trim() === '') {
                throw new Error('Empty task');
            }
            this.entries = [task, ...this.entries];
            this.update();
            this.save();
        } catch (error) {
            this.inputError(error.message);
        }
    }

    delete(task) {
        const filteredEntries = this.entries.filter(entry => entry !== task);
        this.entries = filteredEntries;
        this.update();
        this.save();
    }
}

export class TaskView extends Task {
    constructor(root) {
        super(root);
        this.taskContainer = document.querySelector('.all-tasks');
        this.update();
        this.onadd();
        this.onfocus();
    }
    onadd() {
        const addButton = document.querySelector('.create');
        addButton.onclick = () => {
            const { value } = document.getElementById('input-task');
            const task = { value: value, isChecked: false };
            this.add(task);
        }
    }

    onfocus() {
        const input = document.querySelector('#input-task');
        input.onchange = () => {
            document.querySelector('.message-error').classList.remove('show');
        }
    }

    oncheck(task, entry) { 
        const counter = document.querySelector('#counter-concluded>.counter');
        task.onclick = () => {
            if (task.classList.contains('done')) {
                task.classList.remove('done'); 
                this.updateIsChecked(entry);
                let ac = this.countCheck()  ;
                counter.textContent = `${ac} de ${this.entries.length}`;
            }
            else {
                task.classList.add('done'); 
                this.updateIsChecked(entry);
                let ac = this.countCheck()  ; 
                counter.textContent = `${ac} de ${this.entries.length}`;

            }
        }
    }

    update() {
        this.removelAllTasks();
        if (this.entries.length > 0) {
            this.hideNoTasks();

            this.entries.forEach(entry => {  
                const task = this.createTask();
                task.querySelector('span').textContent = entry.value;
                task.querySelector('#checkbox-task').onclick = () => { this.oncheck(task, entry) }

                if (entry.isChecked) {
                    task.classList.add('done');
                    task.querySelector('#checkbox-task').setAttribute('checked', true);
                }

                task.querySelector('.trash').onclick = () => {
                    this.delete(entry);
                };

                this.taskContainer.append(task);
            })
        }
        else {
            this.showNoTasks();
        }

        this.updateCount();
    }

    updateCount() {
        const all = document.querySelector('#counter-all>.counter');
        const done = document.querySelector('#counter-concluded>.counter');
        const ac = this.countCheck();
        all.textContent = this.entries.length;
        done.textContent = `${ac} de ${this.entries.length}`;
    }


    createTask() {
        const task = document.createElement('div');
        task.classList.add('task');
        task.innerHTML = ` 
        <div class="checkbox-wrapper">
            <label for="checkbox"></label>
            <input type="checkbox" name="checkbox" id="checkbox-task">
        </div>
        <span>Integer urna interdum massa libero auctor neque turpis turpis semper. Duis vel sed fames integer.</span>
        <div class="trash">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.2021 9.98547H12.8716V15.5073H14.2021V9.98547Z" fill="#808080"/>
                <path d="M11.4624 9.98547H10.1318V15.5073H11.4624V9.98547Z" fill="#808080"/>
                <path d="M18.478 7.16712C18.4754 7.03061 18.4295 6.89846 18.3469 6.78975C18.2642 6.68104 18.1492 6.6014 18.0184 6.56232C17.9596 6.53782 17.8974 6.52252 17.8339 6.51696H14.2868C14.1525 6.07791 13.8808 5.69355 13.5117 5.42047C13.1426 5.14739 12.6956 5 12.2365 5C11.7774 5 11.3304 5.14739 10.9613 5.42047C10.5922 5.69355 10.3205 6.07791 10.1862 6.51696H6.63911C6.58068 6.51814 6.52269 6.52729 6.46674 6.54418H6.45162C6.31318 6.58701 6.19334 6.67547 6.11163 6.79515C6.02992 6.91483 5.99117 7.05866 6.00169 7.20319C6.01222 7.34771 6.0714 7.48441 6.16958 7.59099C6.26776 7.69757 6.39916 7.76774 6.54234 7.79006L7.25298 17.5334C7.26382 17.9127 7.41693 18.2741 7.68191 18.5458C7.94688 18.8175 8.30435 18.9797 8.68332 19H15.7867C16.1662 18.9804 16.5244 18.8186 16.79 18.5468C17.0556 18.2751 17.2092 17.9132 17.22 17.5334L17.9277 7.79914C18.0802 7.77797 18.22 7.70232 18.3212 7.58615C18.4223 7.46999 18.478 7.32116 18.478 7.16712ZM12.2365 6.21456C12.3661 6.21458 12.4943 6.24146 12.6129 6.29351C12.7316 6.34556 12.8382 6.42164 12.926 6.51696H11.547C11.6346 6.42135 11.7411 6.34507 11.8599 6.29299C11.9786 6.24092 12.1069 6.21421 12.2365 6.21456ZM15.7867 17.7904H8.68332C8.60168 17.7904 8.47467 17.6573 8.45955 17.4457L7.75798 7.81123H16.715L16.0135 17.4457C15.9984 17.6573 15.8714 17.7904 15.7867 17.7904Z" fill="#808080"/>
                </svg>
                
        </div> `
        return task;
    }

    showNoTasks() {
        const empty = document.createElement('div');
        empty.classList.add('task-empty');
        empty.innerHTML = ` 
            <img src="./img/clipboard.png" alt="ícone clipboard">
            <h2 class="bolder">Você ainda não tem tarefas cadastradas </h2>
            <h2>Crie tarefas e organize seus itens a fazer</h2> `;
        this.taskContainer.append(empty);
    }

    hideNoTasks() {
        const messageEmpty = document.querySelector('.task-empty');
        if (messageEmpty) messageEmpty.remove();
    }

    inputError(errorMessage) {
        const error = document.querySelector('.message-error');
        error.textContent = errorMessage;
        error.classList.add('show');
    }

    removelAllTasks() {
        this.taskContainer.querySelectorAll('.task').forEach(task => {
            task.remove();
        })
    }
} 