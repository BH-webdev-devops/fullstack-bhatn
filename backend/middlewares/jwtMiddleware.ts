import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'


export const authenticateJWT = async (req :Request, res : Response, next : NextFunction) : Promise<Response | any> => {
    console.log(req.headers)
    const token = req.headers.authorization?.split(' ')[1]
    try {
        if (!token) {
            return res.status(401).json({message : `No token provided`})
        }
        const decoded = jwt.verify(token, String(process.env.JWT_SECRET))
        console.log(decoded)
        if (!decoded) {
            return res.status(401).json({message : `Unauthorized`})
        }
        (req as Request & {user : any}).user = decoded
        next()
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
    
}
