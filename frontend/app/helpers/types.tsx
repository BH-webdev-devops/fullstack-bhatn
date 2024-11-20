
export interface Task {
    id: number;
    name: string;
    todo: number;
    created_at: string;
    updated_at: string;
    completed: boolean;
    deadline: string;
}

export interface Todo {
    id: number;
    title: string;
    description: string;
    user: number;
    created_at: string;
    updated_at: string;
    priority: string;
    completed: boolean;
    tasks: Task[];
    category: string;
}



export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    profilepicture: string;
    todo: Todo[];
}

