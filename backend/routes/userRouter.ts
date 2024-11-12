import {Router} from 'express';
import { getUserProfile, updateUser } from '../controllers/userController';
import { authenticateJWT } from '../middlewares/jwtMiddleware';
import { upload } from '../middlewares/uploadFile';

const userRouter = Router();
userRouter.get('/profile', authenticateJWT, getUserProfile);
userRouter.put('/update', upload.single('image'), authenticateJWT, updateUser);

export default userRouter;