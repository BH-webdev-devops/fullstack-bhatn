import {Request, Response} from 'express';
import {query} from '../db/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { User } from '../types/user';


export const registerUser = async (req: Request, res: Response): Promise<Response|any> => {
    const {name, email, password} = req.body;
    const image = '/public/images/' + req.file?.filename;
    console.log(req.body, req.file);
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await query('INSERT INTO users (name, email, password, profilepicture) VALUES ($1, $2, $3, $4) RETURNING *', [name, email, hashedPassword, image]);
        console.log('User registered success');
        return res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({error: 'Error registering user'});
    }
}

export const loginUser = async (req : Request, res : Response): Promise<Response | any> => {
    const user = (req as Request & {user : User}).user
    console.log(user)

    try{
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if(!isMatch){
            return res.status(400).json({message : `Invalid credentials`})
        }
        const token = jwt.sign({id : user.id}, String(process.env.JWT_SECRET), {expiresIn : '2h'})
        console.log(token)
        return res.status(200).json({message: 'Login successful', token: token, user: {id: user.id, name: user.name, email: user.email, profilepicture: user.profilepicture}})
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}