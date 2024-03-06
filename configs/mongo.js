import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import User from "../src/users/user.model.js";

const SALT_ROUNDS = 10;

export const dbConnection = async () => {
    try {
        mongoose.connection.on('error', () => {
            console.log('MongoDB | could not connect to MongoDB');
            mongoose.disconnect();
        });

        mongoose.connection.on('connecting', () => {
            console.log('MongoDB | Trying to connect');
        });

        mongoose.connection.on('connected', async () => {
            console.log('MongoDB | Connected to MongoDB');

            const adminUser = await User.findOne({ role: 'ADMIN_ROLE' });
            if (!adminUser) {

                const hashedPassword = await bcrypt.hash('123456', SALT_ROUNDS);
                await User.create({
                    name: 'Admin',
                    mail: 'admin@gmail.com',
                    password: hashedPassword,
                    role: 'ADMIN_ROLE'
                });
                console.log('Default admin user created successfully');
            }
        });

        mongoose.connection.on('open', () => {
            console.log('MongoDB | Connected to database');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB | Reconnected to MongoDB');
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB | Disconnected');
        });

        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50
        });
    } catch (error) {
        console.log('Database connection failed', error);
    }
};
