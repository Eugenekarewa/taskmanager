import { ic, nat, update, query, text,bool } from 'azle/experimental';

// Define Task type
type Task = {
    id: nat;                // Use nat for Candid compatibility
    description: string;    // Use string for JavaScript compatibility
    completed: bool;     // Use boolean for JavaScript compatibility
};

// State variables
let tasks: Task[] = [];  // Correctly use Task[] for an array of Task
let nextId: nat = BigInt(0); // Initialize as a bigint

// Add a new task
export const addTask = update([text], nat, (description) => {
    const newTask: Task = {
        id: nextId,
        description,
        completed: false
    };
    tasks.push(newTask);
    nextId += BigInt(1); // Increment using bigint
    return newTask.id;
});

// View all tasks
export const getTasks = query([], [Task], () => {  // Correctly use Task[] as a return type
    return tasks;
});

// Mark a task as completed
export const completeTask = update([nat], bool, (id) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
        task.completed = true;
        return true;
    }
    return false;
});

// Delete a task
export const deleteTask = update([nat], bool, (id) => {
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        return true;
    }
    return false;
});
