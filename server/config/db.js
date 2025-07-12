import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

export const connectToDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URI, {
            dbName: 'ganttflow', // Nombre de la base de datos
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log('MongoDB connection error: ',error.message);
        process.exit(1); // process code 1 means a failure, 0 means success
    }
};

