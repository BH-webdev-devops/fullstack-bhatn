import { Router } from 'express';
import { getTodoList, createTodoList, createTask, getTaskByTodoId, updateTodoList, updateTask, deleteTodoList, deleteTask, getTodoListById, filterTodos } from '../controllers/todoController';
import { authenticateJWT } from '../middlewares/jwtMiddleware';
import { verifyTodo, verifyTask } from '../middlewares/todo';


const todoRouter = Router();
todoRouter.get('/todo', authenticateJWT, getTodoList);
todoRouter.post('/todo', authenticateJWT, verifyTodo, createTodoList);
todoRouter.post('/task', authenticateJWT, verifyTask, createTask);
todoRouter.get('/filter', authenticateJWT, filterTodos);
todoRouter.get('/todo/:id/task', authenticateJWT, getTaskByTodoId);
todoRouter.put('/todo/:id', authenticateJWT, updateTodoList);
todoRouter.put('/task/:id', authenticateJWT, updateTask);
todoRouter.delete('/todo/:id', authenticateJWT, deleteTodoList);
todoRouter.delete('/task/:id', authenticateJWT, deleteTask);
todoRouter.get('/todo/:id', authenticateJWT, getTodoListById);

export default todoRouter;