import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectToDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URI, {
            dbName: 'ganttflow', // Nombre de la base de datos
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log('MongoDB connection error: ',error.message);
        process.exit(1); 
    }
};

