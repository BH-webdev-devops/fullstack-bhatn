import {Request, Response} from "express";
import { query } from "../db/db";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const getUserProfile = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    try {
        const result = await query(`SELECT id, name, email, profile_picture FROM users WHERE id = $1`, [userId])
        const user = result.rows[0]

        if (!user) {
            return res.status(404).json({ message: `User not found` })
        }

        return res.status(200).json({ message: 'Profile data', user })

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}

export const updateUser = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user
    const { name, email, password } = req.body
    const image = '/public/images/' + req.file?.filename
    try {
        const result = await query(`SELECT * FROM users WHERE id = $1`, [userId])
        const user = result.rows[0]
        if (!user) {
            return res.status(404).json({ message: `User not found` })
        }
        const updatedName = name || user.name
        const updatedEmail = email || user.email
        const updatedImage = image || user.profilepicture

        let updatedPassword = user.password
        if (password) {
            const comparePasswords = await bcrypt.compare(password, user.password)
            if (comparePasswords) {
                return res.status(400).json({ message: `New password cannot be the same as the old password` })
            }
            const salt = await bcrypt.genSalt(10)
            updatedPassword = await bcrypt.hash(password, salt)
        }

        await query(`UPDATE users SET name = $1, email = $2, password = $3, profilepicture = $4 WHERE id = $5`, [updatedName, updatedEmail, updatedPassword, updatedImage, userId])
        return res.status(203).json({ message: `User updated successfully` })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}