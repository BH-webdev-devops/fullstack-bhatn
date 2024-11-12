import { Request, Response, NextFunction } from "express";
import { query } from '../db/db'

export const verifyTodo = async (req: Request, res: Response, next: NextFunction): Promise<Response | any> => {
    const { title, description, priority, category, tasks, completed } = req.body
    console.log('inside checkUserData')
    try {
        if (!title || !priority || !category) {
            return res.status(403).json({ message: `Title, Priority and Category are required fields` })
        }
        else {
            if (!description) {
                req.body.description = ''
            }
            // if (!tasks) {
            //     req.body.tasks = []
            // } else {
            //     req.body.tasks = tasks.map((task: any) => {
            //         if (!task.name) {
            //             return res.status(403).json({ message: `Task name is required` })
            //         }
            //         if (!task.completed) {
            //             task.completed = false
            //         }
            //         return task
            //     })
            // }

            // if (!completed) {
            //     req.body.completed = false
            // }
            console.log('inside checkUserData worked')
            next()
        }
    }


    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}


export const verifyTask = async (req: Request, res: Response, next: NextFunction): Promise<Response | any> => {
    const { todoId, name, completed } = req.body
    console.log('inside checkUserData')
    try {

        const result = await query(`SELECT * FROM todo WHERE id = $1 `, [todoId])
        if (!result.rows[0]) {
            return res.status(404).json({ message: `Todo not found` })
        }
        if (!name) {
            return res.status(403).json({ message: `Task name is required` })
        }
        if (!completed) {
            req.body.completed = false
        }
        console.log('inside checkUserData worked')
        next()
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}



