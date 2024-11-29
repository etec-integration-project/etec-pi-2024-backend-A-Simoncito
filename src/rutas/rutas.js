import express from 'express'
import { registrar, iniciarSesion, listarUsuarios, productos, ratings, calificar, soporte, addProductos, editarCalificacion, getMyRating, editarIncidencia, getMySupport, eliminarIncidendia, logout } from '../controladores/controladores.js'
import { estaAutenticado } from '../middleware/estaAutenticado.js'

const router = express.Router()

// RUTAS:
router.post('/registrar', registrar)
router.post('/login', iniciarSesion)
router.post('/logout', logout)

router.get('/usuarios', listarUsuarios); 
router.get('/productos', productos)
router.get('/ratings', ratings)

router.post('/add-product', estaAutenticado, addProductos)

router.post('/rate', estaAutenticado, calificar)
router.get('/my-rating', estaAutenticado, getMyRating)
router.patch('/edit-rating', estaAutenticado, editarCalificacion)

router.post('/soporte', estaAutenticado, soporte)
router.get('/user-soporte', estaAutenticado, getMySupport)
router.patch('/edit-support', estaAutenticado, editarIncidencia)
router.delete('/eliminar-incidencia/:support_id', estaAutenticado, eliminarIncidendia)

export default router;
