import express from 'express'
import {createPool} from 'mysql2/promise'
import {config} from 'dotenv'
import rutas from './rutas/rutas.js';
import cors from "cors";
config()


const app = express ()

export const pool = createPool({
    host: process.env.MYSQLDB_HOST,
    user: 'root',
    password: process.env.MYSQLDB_PASSWORD,
    port: process.env.MYSQLDB_DOCKER_PORT,
    database: process.env.MYSQLDB_DATABASE 

})

app.use(cors());
app.use(express.json());

const initializeDatabase = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS productos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nameProduct VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                urlImage VARCHAR(255) NOT NULL
            )
        `);

        console.log("Tabla 'users' creada exitosamente.");
    } catch (error) {
        console.error('Error al intentar crear la tabla:', error);
    }
    try {
        // ========== PRODUCTS ==========
        const [rows, fields] = await pool.query('SELECT * FROM productos');

        if (rows.length === 0) {
            // Insertar productos si no existen
            const productos = [
                ["Galgo Ingles", "Descripcion para Galgo en un futuro", "https://i.imgur.com/jdl4Khr.jpeg"],
                ["Dálmata", "Descripcion para Dalmata en un futuro", "https://i.imgur.com/zKwL7D4.jpeg"],
                ["Corgi", "Descripcion para Corgi en un futuro", "https://i.imgur.com/0duBbbu.jpeg"],
                ["Chow Chow", "Descripcion para chow chow en un futuro", "https://i.imgur.com/z3FoDmX.jpeg"],
                ["Bull Terrier", "Descripcion para Bull Terrier en un futuro", "https://i.imgur.com/ZYXa9zr.jpeg"],
                ["Borzoi", "Descripcion para Borzoi en un futuro", "https://i.imgur.com/lGpLLfo.jpeg"]

            ];

            const insertQuery = 'INSERT INTO productos (nameProduct, description, urlImage) VALUES (?, ?, ?)';

            for (const producto of productos) {
                await pool.query(insertQuery, producto);
            }
        }


        console.log("Base inicializada correctamente");
    } catch (error) {
        console.error("Error inicializando la base de datos:", error);
    }
        
    

};

app.get('/',(req, res) => {
    res.send('Hola mundo')
})

app.get('/hora',async (req, res) => {
    const result = await pool.query('SELECT NOW()')
    res.json(result[0])

})

app.use('/users', rutas);

app.listen(3000, async () => {
    await initializeDatabase();
    console.log('Servidor corriendo en el puerto', 3000);
});

