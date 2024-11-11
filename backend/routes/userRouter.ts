import {Router} from 'express';
import { getUserProfile } from '../controllers/userController';
import { authenticateJWT } from '../middlewares/jwtMiddleware';

const userRouter = Router();
userRouter.get('/profile', authenticateJWT, getUserProfile);

export default userRouter;