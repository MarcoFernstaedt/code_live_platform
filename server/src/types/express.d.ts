import { IUser } from '../models/User.js'
import "@clerk/express";

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }       
    }
}