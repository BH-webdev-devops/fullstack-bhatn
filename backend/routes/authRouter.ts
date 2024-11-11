import {Router} from 'express';
import {registerUser, loginUser} from '../controllers/authController';
import {checkUserData, checkIfUserExist} from '../middlewares/checkUser';
import {upload} from '../middlewares/uploadFile';

const authRouter = Router();

authRouter.post('/register', upload.single('image'), checkUserData(true), checkIfUserExist(false),  registerUser);
authRouter.post('/login', checkUserData(false), checkIfUserExist(true), loginUser)


export default authRouter;