import mongoose from 'mongoose';
import { ENV } from './env.js';

const connectDB = async (): Promise<void> => {
    try {
        const { DATABASE_URI } = ENV;
        if (!DATABASE_URI) throw new Error('MONGO_URI is not set');

        const conn = await mongoose.connect(DATABASE_URI);
        console.log('Connected to Database', conn.connect)
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};

export default connectDB;