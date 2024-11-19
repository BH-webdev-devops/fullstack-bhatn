import { Task } from './Task';
interface Todo {
    id : number;
    title : string;
    description : string;
    user : number;
    created_at : string;
    updated_at : string;
    priority:   string;
    completed : boolean;
    tasks: Task[];
    category: string;
}

export type {Todo}