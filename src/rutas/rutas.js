import express from 'express';
import { registrar, iniciarSesion, listarUsuarios, productos } from '../controladores/controladores.js';

const router = express.Router();

// RUTAS:
router.post('/registrar', registrar);
router.post('/login', iniciarSesion);
router.get('/usuarios', listarUsuarios);  
router.get('/productos', productos);  

export default router;
