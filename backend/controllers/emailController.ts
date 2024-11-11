import {Request, Response} from 'express'; 
import {emailTransporter} from '../middlewares/emailTransporters';

export const sendEmail = async (req : Request, res : Response) : Promise<Response | any> => {
    const {subject, text} = req.body
    console.log(req.body)
    try {
        const mailOptions = {
            from: String(process.env.EMAIL),
            to: String(process.env.EMAIL),
            subject: subject,
            text: text
        };
        await emailTransporter.sendMail(mailOptions, function(error: any, info: any){
            if (error) {
                console.log(error);
                return res.status(500).json({message : `Internal server error`})
            } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).json({message : `Email sent`})
            }
        });
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({message : `Internal server error`})
    }
}