import express from 'express';
import { registrar, iniciarSesion, listarUsuarios, productos, ratings, calificar, soporte } from '../controladores/controladores.js';

const router = express.Router();

// RUTAS:
router.post('/registrar', registrar);
router.post('/login', iniciarSesion);
router.get('/usuarios', listarUsuarios);  
router.get('/productos', productos);
router.get('/ratings', ratings);
router.post('/rate', calificar);
router.post('/soporte', soporte);

export default router;
