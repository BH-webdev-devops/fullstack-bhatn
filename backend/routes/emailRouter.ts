import {Router} from 'express';
import {sendEmail} from '../controllers/emailController';

const emailRouter = Router();

emailRouter.get('/send-email', sendEmail)

export default emailRouter;