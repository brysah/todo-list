export class Task {
    constructor(root) {
        this.root = document.querySelector(root);
        this.entries = [];
    }

    add(value) {
        const taskExists = this.entries.find(  task => task === value );
        if(taskExists){
            console.log('Task already exist');
            return;
        }  
        this.entries = [value,...this.entries];
        this.update();
    }

}

export class TaskView extends Task {
    constructor(root) {
        super(root);
        this.onadd();
    }
    onadd() {
        const addButton = document.querySelector('.create');
        addButton.onclick = () => {
            const { value } = document.getElementById('input-task');
            console.log(value);
            this.add(value);
        }
    }
}