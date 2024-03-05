import mongoose from "mongoose";
import User from "../src/users/user.model.js";

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

            // Verificar si ya existe un usuario administrador
            const adminUser = await User.findOne({ role: 'ADMIN_ROLE' });
            if (!adminUser) {
                // Crear un usuario administrador predeterminado
                await User.create({
                    name: 'Admin',
                    mail: 'admin@example.com',
                    password: 'adminPassword', // ¡Recuerda cambiar esto por una contraseña segura!
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
