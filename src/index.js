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
                ["Cup 1", "Descripcion para Cup 1", "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"],
                ["Cup 2", "Descripcion para Cup 2", "https://images.unsplash.com/photo-1570784332176-fdd73da66f03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"],
                ["Cup 3", "Descripcion para Cup 3", "https://images.unsplash.com/photo-1570784332176-fdd73da66f03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"],
                ["Cup 4", "Descripcion para Cup 4", "https://images.unsplash.com/photo-1570784332176-fdd73da66f03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"],
                ["Cup 5", "Descripcion para Cup 5", "https://images.unsplash.com/photo-1570784332176-fdd73da66f03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"]
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

