import express from 'express'
import {
    home,
    getFormCategoria,
    saveCategoria,
    getFormProducto,
    saveProducto,
    deleteProducto,
    getFormEditarProducto,
    updateProducto,
   getAuth
} from '../controllers/mordiskoController.js'

const router = express.Router()

router.get('/', home)

/// RUTAS DE AUTENTICACIÓN
router.get('/login', getAuth.showLogin);      // Muestra el login
router.post('/login', getAuth.loginPost);     // Procesa el login

router.get('/register', getAuth.showRegister); // Muestra el registro (nuvo usuario)
router.post('/register', getAuth.register);   // Procesa el registro

// categorias
router.get('/crear-categoria', getFormCategoria)
router.post('/crear-categoria', saveCategoria)

// productos
router.get('/crear-producto', getFormProducto)
router.post('/crear-producto', saveProducto)

//editar producto
router.get('/editar-producto/:id', getFormEditarProducto)
router.post('/editar-producto/:id', updateProducto)

//eliminar producto
router.post('/eliminar-producto/:id', deleteProducto)

export default router