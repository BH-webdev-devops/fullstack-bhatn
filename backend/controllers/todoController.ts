import { Request, Response } from "express";
import { query } from "../db/db";

export const getCurrentTimestamp = (): Promise<any> => {
    const currentTimestamp = new Date().toISOString();
    return Promise.resolve(currentTimestamp);
};

export const getTodoList = async (req: Request, res: Response): Promise<Response | any> => {
    console.log('inside getTodoList')
    console.log((req as Request & { user: any }).user.id)
    const userId = (req as Request & { user: any }).user.id
    try {
        const result = await query(`SELECT 
                t.id AS id,
                t.title AS title,
                t.description AS description,
                t.user_id,
                t.created_at AS created_at,
                t.updated_at AS updated_at,
                t.priority,
                t.completed AS completed,
                t.category,
                tk.id AS task_id,
                tk.name AS task_name,
                tk.created_at AS task_created_at,
                tk.updated_at AS task_updated_at,
                tk.completed AS task_completed
            FROM 
                Todo t
            LEFT JOIN 
                Task tk ON t.id = tk.todo_id
            WHERE t.user_id = $1
            ORDER BY 
                t.id, tk.id;;`, [userId])
        const todo = result.rows

        if (!todo) {
            return res.status(404).json({ message: `No Todo list found` })
        }

        const todos = result.rows.reduce((acc: any[], row: any) => {
            let todo = acc.find((t: any) => t.id === row.id);
            if (!todo) {
                todo = {
                    id: row.id,
                    title: row.title,
                    description: row.description,
                    user_id: row.user_id,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    priority: row.priority,
                    completed: row.completed,
                    category: row.category,
                    tasks: []
                };
                acc.push(todo);
            }
            if (row.task_id) {
                todo.tasks.push({
                    task_id: row.task_id,
                    task_name: row.task_name,
                    task_created_at: row.task_created_at,
                    task_updated_at: row.task_updated_at,
                    task_completed: row.task_completed
                })
            };
            return acc;
        }, []);

        return res.status(200).json({
            message: "Todo Lists",
            todo: todos
        });

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}

export const getTodoListById = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    const todoId = req.params.id
    try {
        const result = await query(`SELECT 
                t.id AS id,
                t.title AS title,
                t.description AS description,
                t.user_id,
                t.created_at AS created_at,
                t.updated_at AS updated_at,
                t.priority,
                t.completed AS completed,
                t.category
            FROM 
                todo t
            WHERE t.user_id = $1 AND t.id = $2
            ORDER BY 
                t.id;`, [userId, todoId])
        const todo = result.rows

        if (!todo) {
            return res.status(404).json({ message: `Todo not found` })
        }

        const todos = result.rows.reduce((acc: any[], row: any) => {
            let todo = acc.find((t: any) => t.id === row.id);
            if (!todo) {
                todo = {
                    id: row.id,
                    title: row.title,
                    description: row.description,
                    user_id: row.user_id,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    priority: row.priority,
                    completed: row.completed,
                    category: row.category,
                    tasks: []
                };
                acc.push(todo);
            }
            if (row.task_id) {
                todo.tasks.push({
                    task_id: row.task_id,
                    task_name: row.task_name,
                    task_created_at: row.task_created_at,
                    task_updated_at: row.task_updated_at,
                    task_completed: row.task_completed
                })
            };
            return acc;
        }, []);

        return res.status(200).json({
            message: "Todo Lists",
            todo: todos[0]
        });
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }

}

export const getTaskByTodoId = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    console.log(req.params)
    const taskId = req.params.id
    try {
        const result = await query(`SELECT 
                id, name, created_at, updated_at, completed, deadline
            FROM 
                task
            WHERE todo_id = $1
            ORDER BY 
                id;`, [taskId])
        const task = result.rows
        console.log('tasks', task)

        if (!task) {
            return res.status(404).json({ message: `No tasks found` })
        }

        // const tasks = result.rows.reduce((acc: any[], row: any) => {
        //     let task = acc.find((t: any) => t.task_id === row.task_id);
        //     if (task) {
        //         task = {
        //             task_id: row.task_id,
        //             task_name: row.task_name,
        //             task_created_at: row.task_created_at,
        //             task_updated_at: row.task_updated_at,
        //             task_completed: row.task_completed
        //         };
        //         acc.push(task);
        //     }
        //     return acc;
        // }, []);

        // console.log('tasks', task)

        return res.status(200).json({
            message: "Task",
            task: task
        });
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }

}

export const createTodoList = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    const { title, description, priority, category, tasks, completed } = req.body
    console.log(title, description, priority, category, tasks)
    try {
        console.log('inside createTodoList')
        const result = await query(`INSERT INTO todo (title, description, user_id, priority, category, created_at, completed) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [title, description, userId, priority, category, await getCurrentTimestamp(), completed])
        // if (tasks) {
        //     const result = await query(`SELECT id FROM todo WHERE user_id = $1 AND title = $2`, [userId, title])
        //     const todoId = result.rows[0].id
        //     tasks.forEach(async (task: any) => {
        //         const { name, completed } = task
        //         await query(`INSERT INTO task (name, todo_id, completed, created_at) VALUES ($1, $2, $3, $4)`, [name, todoId, completed, await getCurrentTimestamp()])
        //     })
        // }
        return res.status(201).json({ message: `Todo created successfully`, todo: result.rows[0] })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}

export const createTask = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    const { todoId, name, completed, deadline } = req.body
    try {
        const created_at = await getCurrentTimestamp()
        const result = await query(`INSERT INTO task (name, todo_id, completed, created_at, deadline) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [name, todoId, completed, created_at, deadline])
        if (!result) {
            return res.status(404).json({ message: `Task not created` })
        }
        return res.status(201).json({
            message: `Task created successfully`, task: result.rows[0]
        })
    }

    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}

export const updateTodoList = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    const todoId = req.params.id
    const { title, description, priority, category, completed } = req.body
    console.log(title, description, priority, category, completed)
    try {
        const result = await query(`SELECT * FROM todo WHERE id = $1`, [todoId])
        const todo = result.rows[0]
        if (!todo) {
            return res.status(404).json({ message: `Todo not found` })
        }
        const updatedTitle = title || todo.title
        const updatedDescription = description || todo.description
        const updatedPriority = priority || todo.priority
        const updatedCategory = category || todo.category
        const updatedCompleted = completed || todo.completed

        await query(`UPDATE todo SET title = $1, description = $2, priority = $3, category = $4, completed = $5, updated_at = $6, user_id = $7 WHERE id = $8`, [updatedTitle, updatedDescription, updatedPriority, updatedCategory, updatedCompleted, await getCurrentTimestamp(), userId, todoId])
        return res.status(203).json({ message: `Todo updated successfully` })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}

export const updateTask = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    const taskId = req.params.id
    const { name, completed, deadline } = req.body
    console.log(name, completed)
    try {
        const result = await query(`SELECT * FROM task WHERE id = $1`, [taskId])
        const task = result.rows[0]
        if (!task) {
            return res.status(404).json({ message: `Task not found` })
        }
        const updatedName = name || task.name
        const updatedCompleted = completed || task.completed
        const updatedDeadline = deadline || task.deadline

        await query(`UPDATE task SET name = $1, completed = $2, updated_at = $3, deadline = $5 WHERE id = $4`, [updatedName, updatedCompleted, await getCurrentTimestamp(), taskId, updatedDeadline])
        return res.status(203).json({ message: `Task updated successfully` })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}

export const deleteTodoList = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    const todoId = req.params.id
    try {
        const result = await query(`SELECT * FROM todo WHERE id = $1`, [todoId])
        const todo = result.rows[0]
        if (!todo) {
            return res.status(404).json({ message: `Todo not found` })
        }
        await query(`DELETE FROM todo WHERE id = $1`, [todoId])
        return res.status(203).json({ message: `Todo deleted successfully` })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}

export const deleteTask = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    const taskId = req.params.id
    try {
        const result = await query(`SELECT * FROM task WHERE id = $1`, [taskId])
        const task = result.rows[0]
        if (!task) {
            return res.status(404).json({ message: `Task not found` })
        }
        await query(`DELETE FROM task WHERE id = $1`, [taskId])
        return res.status(203).json({ message: `Task deleted successfully` })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}

export const filterByCategory = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    const category = req.params.category
    try {
        const result = await query(`SELECT 
                t.id AS id,
                t.title AS title,
                t.description AS description,
                t.user_id,
                t.created_at AS created_at,
                t.updated_at AS updated_at,
                t.priority,
                t.completed AS completed,
                t.category,
                tk.id AS task_id,
                tk.name AS task_name,
                tk.created_at AS task_created_at,
                tk.updated_at AS task_updated_at,
                tk.completed AS task_completed
            FROM 
                Todo t
            LEFT JOIN 
                Task tk ON t.id = tk.todo_id
            WHERE t.user_id = $1 AND t.category = $2
            ORDER BY 
                t.id, tk.id;;`, [userId, category])
        const todo = result.rows

        if (!todo) {
            return res.status(404).json({ message: `No Todo list found` })
        }

        const todos = result.rows.reduce((acc: any[], row: any) => {
            let todo = acc.find((t: any) => t.id === row.id);
            if (!todo) {
                todo = {
                    id: row.id,
                    title: row.title,
                    description: row.description,
                    user_id: row.user_id,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    priority: row.priority,
                    completed: row.completed,
                    category: row.category,
                    tasks: []
                };
                acc.push(todo);
            }
            if (row.task_id) {
                todo.tasks.push({
                    task_id: row.task_id,
                    task_name: row.task_name,
                    task_created_at: row.task_created_at,
                    task_updated_at: row.task_updated_at,
                    task_completed: row.task_completed
                })
            };
            return acc;
        }, []);

        return res.status(200).json({
            message: "Todo Lists",
            todo: todos
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
};

export const filterByPriority = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    const priority = req.params.priority
    try {
        const result = await query(`SELECT 
                t.id AS id,
                t.title AS title,
                t.description AS description,
                t.user_id,
                t.created_at AS created_at,
                t.updated_at AS updated_at,
                t.priority,
                t.completed AS completed,
                t.category,
                tk.id AS task_id,
                tk.name AS task_name,
                tk.created_at AS task_created_at,
                tk.updated_at AS task_updated_at,
                tk.completed AS task_completed
            FROM 
                Todo t
            LEFT JOIN 
                Task tk ON t.id = tk.todo_id
            WHERE t.user_id = $1 AND t.priority = $2
            ORDER BY 
                t.id, tk.id;;`, [userId, priority])
        const todo = result.rows

        if (!todo) {
            return res.status(404).json({ message: `No Todo list found` })
        }

        const todos = result.rows.reduce((acc: any[], row: any) => {
            let todo = acc.find((t: any) => t.id === row.id);
            if (!todo) {
                todo = {
                    id: row.id,
                    title: row.title,
                    description: row.description,
                    user_id: row.user_id,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    priority: row.priority,
                    completed: row.completed,
                    category: row.category,
                    tasks: []
                };
                acc.push(todo);
            }
            if (row.task_id) {
                todo.tasks.push({
                    task_id: row.task_id,
                    task_name: row.task_name,
                    task_created_at: row.task_created_at,
                    task_updated_at: row.task_updated_at,
                    task_completed: row.task_completed
                })
            };
            return acc;
        }, []);

        return res.status(200).json({
            message: "Todo Lists",
            todo: todos
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}


