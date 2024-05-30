import express from 'express';
import { registrar, iniciarSesion, listarUsuarios } from '../controladores/controladores.js';

const router = express.Router();

router.post('/registrar', registrar);
router.post('/iniciar-sesion', iniciarSesion);
router.get('/usuarios', listarUsuarios);  

export default router;
