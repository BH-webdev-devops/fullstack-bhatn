import { Todo } from './Todo';
interface User {
    id : number;
    name : string; 
    email : string;
    password : string;
    profilepicture : string;
    todo: Todo[];
}

export type {User}