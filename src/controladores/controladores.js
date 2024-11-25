import { pool } from '../index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

const registrar = async (req, res) => {
    const { name, password } = req.body;

    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE name = ?', name);

        if (existingUser.length > 0) {
            return res.status(409).json({ mensaje: 'El usuario ya existe'});
        }

        const passwordHashed = await bcrypt.hash(password, 8);
        const [results] = await pool.query('INSERT INTO users (name, password) VALUES (?, ?)', [name, passwordHashed]);

        res.status(201).json({ mensaje: 'Usuario registrado con éxito'});
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar usuario', error});
    }
};


const iniciarSesion = async (req, res) => {
    const { name, password } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE name = ?', [name]);

        if (rows.length === 0) {
            return res.status(404).send('No se encontro al usuario');
        }

        const usuario = rows[0];
        const esContrasenaValida = await bcrypt.compare(password, usuario.password);

        if (!esContrasenaValida) {
            return res.status(401).send('Contraseña incorrecta');
        }

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ 
            token,
            message: 'Sesión iniciada con éxito' 
        });

        
    } catch (error) {
        res.status(500).send('Error al iniciar sesión');
    }
};

const listarUsuarios = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, username FROM users');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).send('Error al mostrar los usuarios');
    }

    
};
const productos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).send('Error al mostrar los productos');
    }

    
};

const ratings = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT AVG(rating) AS calificacion FROM ratings');
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).send('Error al mostrar los usuarios');
    }
};

const calificar = async (req, res) => {
    const { rating } = req.body;

    try {
        const [results] = await pool.query('INSERT INTO ratings (rating) VALUES (?)', [rating]);

        res.status(201).json({ mensaje: 'Calificación registrada con éxito'});
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al calificar la página', error});
    }
};

const soporte = async (req, res) => {
    const { email, content } = req.body;

    try {
        const [results] = await pool.query('INSERT INTO spoprte (email, contenido) VALUES (?, ?)', [email, content]);

        res.status(201).json({ mensaje: 'Mensaje de soporte enviado con éxito'});
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al enviar mensaje de soporte', error});
    }
};

export { registrar, iniciarSesion, listarUsuarios, productos, ratings, calificar, soporte };
