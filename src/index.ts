import { ic, nat, update, query, text, bool, Vec, Record } from 'azle/experimental';

// Define Task type
type Task = {
    id: bigint;                // Use nat for Candid compatibility
    description: string;       // Use string for JavaScript compatibility
    completed: bool;           // Use boolean for JavaScript compatibility
};

// Candid representation for Task type
const TaskCandid = Record({
    id: nat,
    description: text,
    completed: bool
});

// State variables
let tasks: Task[] = [];         // Array of Task
let nextId: nat = BigInt(0);    // Initialize as a bigint

// Helper function to find a task index by ID with error handling
const findTaskIndexById = (id: bigint): number => {
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) {
        throw new Error(`Task with ID ${id} not found.`);
    }
    return index;
};

// Helper function to validate task descriptions
const validateDescription = (description: string): void => {
    if (!description || description.trim().length === 0) {
        throw new Error("Task description cannot be empty or just whitespace.");
    }
};

// Helper function to find a task by ID with better error handling
const findTaskIndexById = (id: bigint): number => {
    return tasks.findIndex((task) => task.id === id);
};

// Add a new task with input validation
export const addTask = update([text], nat, (description) => {
    if (!description) {
        throw new Error("Task description cannot be empty.");
    }
    const newTask: Task = {
        id: nextId,
        description,
        completed: false
    };
    tasks.push(newTask);

    return newTask.id; // Return the task ID
});

// View all tasks
export const getTasks = query([], Vec(TaskCandid), () => {
    return tasks.map(task => ({
        id: task.id,
        description: task.description,
        completed: task.completed
    }));
});

// Mark a task as completed with error handling
export const completeTask = update([nat], bool, (id) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
        task.completed = true;
        return true; // Task marked as completed
    }
    return false; // Task not found
});

// Delete a task with better error handling
export const deleteTask = update([nat], bool, (id) => {
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        return true; // Task deleted
    }
    return false; // Task not found
});