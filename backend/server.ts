import express, { Application, Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import { pool } from './db/db';
import bodyParser from 'body-parser';
import authRouter from './routes/authRouter';
import userRouter from './routes/userRouter';
import emailRouter from './routes/emailRouter';
import todoRouter from './routes/todoRouter';


const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const fs = require('fs');

app.get('/images', (req, res) => {
    fs.readdir('public/images', (err: any, files: any) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json({ images: files });
        }
    });
});

app.get('/', (req: Request, res: Response): any => {
    return res.send(`Welcome to our node and postgres API server`)
})

app.use('/public/images', express.static('public/images'))


app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', emailRouter);
app.use('/api', todoRouter);

const startServer = async () => {
    try {
        const client = await pool.connect();
        console.log('Database connected');
        client.release();
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on https://fullstack-bhatn.onrender.com/`);
        });
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
}

startServer();
