export class Task{
    constructor(root){
        this.root = document.querySelector(root); 
    }
}

export class TaskView extends Task{
    constructor(root){
        super(root);
    }
}