import { ic, nat, update, query, text, bool, Vec, Record } from 'azle/experimental';

// Define Task type
type Task = {
    id: bigint;                // Use nat for Candid compatibility
    description: string;       // Use string for JavaScript compatibility
    completed: bool;           // Use boolean for JavaScript compatibility
};

const TaskCandid = Record({
    id: nat,
    description: text,
    completed: bool
});

// State variables
let tasks: Task[] = [];  // Array of Task
let nextId: nat = BigInt(0); // Initialize as a bigint

// Helper function to find a task by ID with better error handling
const findTaskIndexById = (id: bigint): number => {
    return tasks.findIndex((task) => task.id === id);
};

// Add a new task with input validation
export const addTask = update([text], nat, (description) => {
    // Validate that the description is not empty or just whitespace
    if (!description || description.trim().length === 0) {
        throw new Error("Task description cannot be empty or just whitespace.");
    }

    const newTask: Task = {
        id: nextId,
        description,
        completed: false
    };

    // Increment before pushing the task to ensure uniqueness
    nextId += BigInt(1);
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
    // Validate that the ID is valid
    if (id < BigInt(0)) {
        throw new Error("Invalid task ID.");
    }

    const taskIndex = findTaskIndexById(id);
    if (taskIndex === -1) {
        throw new Error(`Task with id ${id} not found.`);
    }

    tasks[taskIndex].completed = true;
    return true; // Task marked as completed
});

// Delete a task with better error handling
export const deleteTask = update([nat], bool, (id) => {
    // Validate that the ID is valid
    if (id < BigInt(0)) {
        throw new Error("Invalid task ID.");
    }

    const taskIndex = findTaskIndexById(id);
    if (taskIndex === -1) {
        throw new Error(`Task with id ${id} not found.`);
    }

    tasks.splice(taskIndex, 1);
    return true; // Task deleted
});
