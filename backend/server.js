import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from 'dotenv';

import productRoutes from "./routes/productRoutes.js"
import { sql } from "./config/db.js";

dotenv.config(); //Inicializamos nuestravariable cama manipular las variables de entorno


const app = express(); // Definimos una variable en la cual vamos a almacenar Express

app.use(express.json());
// app.use(cors());
app.use(helmet()); // helmet is a segurity middleware that helps you protect your app by setting HTTP headers
app.use(morgan("dev")); // log the reques


// Definimos el puerto que vamos a usar
const PORT = process.env.PORT || 3000;

// Apply arcjet rate-limit to all routes
app.use(async (req, res, next) => {
    try {
        const decision = await aj.propect(req, {
            requested: 1
        });
        if (decision.isDenied()){
            if(decision.reason.isRateLimit()){
                res.status(429).json({ error: "Too Many Requests"});
            }else if (decision.reason.isBot()){
                res.status(403).json({ error: "Bot access denied"});
            }else {
                res.status(403).json({ error: "Forbidden"});
            }
            return;
        }

        // Check for spoofed bots
        if ( decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())){
            res.status(403).json({error: "Spoofed bot detected"});
            return;
        }
        next()
    } catch (error) {
        console.log("Arcjet error: ", error);
        next(error);
    }
});

// Usamos los diferentes metodos HTTP definidos en el archivo productRoutes.js con esta ruta /api/products como base
app.use('/api/products', productRoutes);


async function initDB() {
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS products(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;

        console.log("Database initialized");
    } catch (error) {
        console.log("Error in initDB: ", error);
    }
}



initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Servidor en egecucion en el puerto: ", PORT)
    });
});