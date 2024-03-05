'use strict'
import express  from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './mongo.js'
import  userRoutes from '../src/users/user.routes.js'
import authRoutes from '../src/auth/auth.routes.js'
import categoryRoutes from '../src/categories/category.routes.js'

class Server{
    constructor(){
        this.app = express();
        this.port  = process.env.PORT;
        this.userPath = '/salesApi/v1/users'
        this.authPath = '/salesApi/v1/auth'
        this.categoryPath = '/salesApi/v1/categories'


        this.conectarDB();
        this.middlewares();
        this.routes();

    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    routes(){
        this.app.use(this.userPath, userRoutes);
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.categoryPath, categoryRoutes);
    }


    listen(){
        this.app.listen(this.port, () =>{
            console.log('Servidor ejecutandose y escuchando el puerto', this.port)
        });
    }
}

export default Server;