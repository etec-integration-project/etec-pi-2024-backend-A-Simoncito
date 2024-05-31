import { pool } from '../index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

const registrar = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (existingUser.length > 0) {
            return res.status(409).send('El usuario ya existe');
        }

        const passwordHashed = await bcrypt.hash(password, 8);
        const [results] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, passwordHashed]);
        res.status(201).send('Usuario registrado con éxito');
    } catch (error) {
        res.status(500).send('Error al registrar usuario');
    }
};

const iniciarSesion = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

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

export { registrar, iniciarSesion, listarUsuarios };
