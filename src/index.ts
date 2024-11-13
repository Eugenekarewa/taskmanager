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

// Add a new task
export const addTask = update([text], nat, (description) => {
    validateDescription(description);

    const newTask: Task = {
        id: nextId,
        description,
        completed: false
    };

    nextId += BigInt(1); // Increment nextId after assigning it
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

// Mark a task as completed
export const completeTask = update([nat], bool, (id) => {
    if (id < BigInt(0)) {
        throw new Error("Task ID must be a positive number.");
    }

    const taskIndex = findTaskIndexById(id);
    tasks[taskIndex].completed = true;

    return true; // Task marked as completed
});

// Delete a task
export const deleteTask = update([nat], bool, (id) => {
    if (id < BigInt(0)) {
        throw new Error("Task ID must be a positive number.");
    }

    const taskIndex = findTaskIndexById(id);
    tasks.splice(taskIndex, 1);

    return true; // Task deleted
});

// Edit a task description
export const editTaskDescription = update([nat, text], bool, (id, newDescription) => {
    if (id < BigInt(0)) {
        throw new Error("Task ID must be a positive number.");
    }
    validateDescription(newDescription);

    const taskIndex = findTaskIndexById(id);
    tasks[taskIndex].description = newDescription;

    return true; // Task description updated
});

// Get tasks filtered by completion status
export const getTasksByCompletion = query([bool], Vec(TaskCandid), (completed) => {
    return tasks
        .filter(task => task.completed === completed)
        .map(task => ({
            id: task.id,
            description: task.description,
            completed: task.completed
        }));
});
