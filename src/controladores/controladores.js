import { pool } from '../index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config()

const registrar = async (req, res) => {
    const { name, password } = req.body;

    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE name = ?', name);

        if (existingUser.length > 0) {
            return res.status(409).json({ mensaje: 'El usuario ya existe'});
        }

        const passwordHashed = await bcrypt.hash(password, 8);
        const [results] = await pool.query('INSERT INTO users (name, password) VALUES (?, ?)', [name, passwordHashed]);

        const [user] = await pool.query('SELECT * FROM users WHERE name = ?', [name]);

        const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.cookie('escudero-app', token)

        res.status(201).json({ mensaje: 'Usuario registrado con éxito'});
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar usuario', error});
    }
}

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

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.cookie('escudero-app', token)

        res.status(200).json({ mensaje: 'Sesión iniciada con éxito'});
        
    } catch (error) {
        res.status(500).send('Error al iniciar sesión');
    }
}

export const logout = async (req, res) => {
    res.clearCookie('escudero-app')
    return res.json({ message: 'logged out' })
}

const listarUsuarios = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, username FROM users');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).send('Error al mostrar los usuarios');
    }

    
}

const productos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).send('Error al mostrar los productos');
    }
}

const ratings = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT AVG(rating) AS calificacion FROM ratings');
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).send('Error al mostrar los usuarios');
    }
}

const getMyRating = async (req, res) => {
    const user_id = req.user.id

    try {
        const [rows] = await pool.query(
            'SELECT * from ratings WHERE user_id = ?',
            [user_id]
        )

        res.status(200).json({ rating: rows[0] })
    } catch (error) {
        res.status(500).send('Error al obtener las calificaciones');
    }
}

const getMySupport = async (req, res) => {
    const user_id = req.user.id

    try {
        const [rows] = await pool.query(
            'SELECT * from soporte WHERE user_id = ?',
            [user_id]
        )

        res.status(200).json({ support: rows[0] })
    } catch (error) {
        res.status(500).send('Error al obtener las incidencias');
    }
}

const editarIncidencia = async (req, res) => {
    const user_id = req.user.id
    const { support_id, new_email, new_content} = req.body

    try {
        const [results] = await pool
            .query('UPDATE soporte SET email = ?, contenido = ? WHERE user_id = ? AND id = ?',
                    [new_email, new_content, user_id, support_id]
            );

        res.status(201).json({ mensaje: 'Incidencia registrada con éxito'});
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar la incidencia', error});
    }
}

const eliminarIncidendia = async (req, res) => {
    const user_id = req.user.id
    // const {support_id} = req.body
    const {support_id} = req.params

    console.log("USER ID: ", user_id);
    console.log("SUPPORT ID: ", support_id);

    try {
        const [results] = await pool
            .query('DELETE FROM soporte WHERE id = ? AND user_id = ?',
                [support_id, user_id]
            );
        
        res.status(201).json({ mensaje: 'Incidencia eliminada con éxito'});
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar la incidencia', error});
    }
}

const calificar = async (req, res) => {
    const { rating, comment } = req.body;
    const user_id = req.user.id

    try {
        const [results] = await pool.query('INSERT INTO ratings (rating, user_id, comment) VALUES (?, ?, ?)', [rating, user_id, comment]);

        res.status(201).json({ mensaje: 'Calificación registrada con éxito'});
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al calificar la página', error});
    }
}

const editarCalificacion = async (req, res) => {
    const user_id = req.user.id
    const { rating_id, new_rating, new_comment} = req.body

    try {
        const [results] = await pool
            .query('UPDATE ratings SET rating = ?, comment = ? WHERE user_id = ? AND id = ?',
                    [new_rating, new_comment, user_id, rating_id]
            );

        res.status(201).json({ mensaje: 'Calificación registrada con éxito'});
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al calificar la página', error});
    }
}

const soporte = async (req, res) => {
    const user_id = req.user.id
    const { email, content } = req.body;

    try {
        const [results] = await pool.query('INSERT INTO soporte (email, contenido, user_id) VALUES (?, ?, ?)', [email, content, user_id]);

        res.status(201).json({ mensaje: 'Mensaje de soporte enviado con éxito'});
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al enviar mensaje de soporte', error});
    }
}

const addProductos = async (req, res) => {
    const user_id = req.user.id

    const { nameProduct, description, urlImage } = req.body;

    try {
        await pool.query('INSERT INTO productos (nameProduct, description, urlImage, user_id) VALUES (?, ?, ?, ?)', [nameProduct, description, urlImage, user_id]);

        res.status(201).json({ mensaje: 'Raza registrada con éxito'});
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar raza', error});
    }
}

export { registrar, iniciarSesion, listarUsuarios, productos, ratings, calificar, soporte, addProductos, editarCalificacion, getMyRating, getMySupport, editarIncidencia, eliminarIncidendia }