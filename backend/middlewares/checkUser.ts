import { Request, Response, NextFunction } from "express";
import { query } from '../db/db'
import { User } from "../types/User";

export const checkUserData = (checkForAllFields: boolean) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<Response | any> => {
        const { name, email, password } = req.body
        console.log('inside checkUserData')
        try {
            if (checkForAllFields) {
                if (!name || !email || !password) {
                    return res.status(403).json({ message: `All fields are required` })
                }
                else {
                    console.log('inside checkUserData worked')
                    next()
                }
            }
            else {
                if (!email || !password) {
                    return res.status(403).json({ message: `Email and password are required` })
                }
                else {
                    console.log('inside checkUserData worked')
                    next()
                }
            }

        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ message: `Internal server error` })
        }
    }
}

export const checkIfUserExist = (checkForExistence: boolean) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const { email } = req.body
        try {
            console.log('inside checkIfUserExists')
            const result = await query(`SELECT * FROM users WHERE email = $1`, [email])
            if (checkForExistence) {
                if (result.rows.length > 0) {
                    (req as Request & { user: User }).user = result.rows[0]
                    console.log('inside checkIfUserExists Worked')
                    next()
                }
                else {
                    return res.status(404).json({ message: `User does not exist` })

                }
            } else {
                if (result.rows.length > 0) {
                    return res.status(400).json({ message: `User already exists` })
                }
                else {
                    console.log('inside checkIfUserExists Worked')
                    next()
                }
            }
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ message: `Internal server error` })
        }
    }
}