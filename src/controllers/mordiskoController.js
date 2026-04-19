import { Categoria, Productos, User } from "../models/index.js"
import bcrypt from "bcryptjs";
import path from 'path';
import fs from 'fs/promises';

// --- Autenticación ---
const getAuth = {
    showLogin: (req, res) => res.render('login'),
    showRegister: (req, res) => res.render('register'),
    
    register: async (req, res) => {
        try {
            const { email, password } = req.body;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            await User.create({ email, password: hashedPassword });
            res.render('resultado', { mensaje: "Usuario registrado con éxito. ¡Inicia sesión!", esExito: true });
        } catch (error) {
            res.render('resultado', { mensaje: 'Error al registrarse', esExito: false });
        }
    },

    loginPost: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email }, raw: true });
            if (!user) return res.render('resultado', { mensaje: "Credenciales incorrectas", esExito: false });

            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                req.session.user = { id: user.id, email: user.email };
                return res.redirect('/'); 
            }
            res.render('resultado', { mensaje: 'Credenciales incorrectas', esExito: false });
        } catch (error) {
            res.status(500).send('Error del servidor');
        }
    },

    logout: (req, res) => {
        req.session.destroy(() => res.redirect('/login'));
    }
};

export const eStaloguado = (req, res, next) => {
    if (req.session && req.session.user) return next();
    res.redirect('/login');
};

// --- Productos ---
const home = async (req, res) => {
    try {
        console.log("Intentando cargar productos..."); // Esto saldrá en tu terminal
        
        
        const productosData = await Productos.findAll(); 
        
        const productos = productosData.map(p => p.get({ plain: true }));
        
        console.log("Productos encontrados:", productos.length);
        
        res.render('home', { products: productos });

    } catch (error) {
        // MUY IMPORTANTE: Esto dirá el error real en la terminal
        console.error("ERROR CRÍTICO EN HOME:", error);
        res.status(500).send(`Error interno: ${error.message}`);
    }
}
/// formulario para crear productos
const getFormProducto = async (req, res) => {
    const categorias = await Categoria.findAll({ raw: true });
    res.render('formProducto', { categorias });
};
 //escuchar  el formullario de producto 
const saveProducto = async (req, res) => {
    try {
        const { nombre, precio, CategoriaId, descripcion } = req.body;
        let nombreImagen = null;

        if (req.files && req.files.imagen) {
            const archivo = req.files.imagen;
            nombreImagen = `${Date.now()}-${archivo.name}`;
            const rutaRela = path.join(process.cwd(), 'src/public/img/productos', nombreImagen);
            await archivo.mv(rutaRela);
        }

        await Productos.create({ nombre, precio, CategoriaId, descripcion, imagen: nombreImagen });
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error al guardar producto');
    }

};
//editar producto
const getFormEditarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        // Buscamos el producto y las categorías para llenar el formulario
        const producto = await Productos.findByPk(id, { raw: true });
        const categorias = await Categoria.findAll({ raw: true });

        res.render('formEditar', {
            producto,
            categorias
        });
    } catch (error) {
        console.error('Error al cargar formulario de edición', error);
        res.status(500).send('Error al cargar formulario de edición');
    }
};

//guardar cambiosde producto editado
const updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, CategoriaId } = req.body;
        const productoActual = await Productos.findByPk(id);
        let nombreImagen = productoActual.imagen;

        if (req.files && req.files.imagen) {
            const archivo = req.files.imagen;
            nombreImagen = `${Date.now()}-${archivo.name}`;
            const rutaNueva = path.join(process.cwd(), 'src/public/img/productos', nombreImagen);
            await archivo.mv(rutaNueva);

            // Borrar imagen vieja si existía
            if (productoActual.imagen) {
                const rutaVieja = path.join(process.cwd(), 'src/public/img/productos', productoActual.imagen);
                await fs.unlink(rutaVieja).catch(() => {});
            }
        }

        await Productos.update(
            { nombre, descripcion, precio, CategoriaId, imagen: nombreImagen },
            { where: { id } }
        );
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error al editar');
    }
};
//eliminar producto 
const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Productos.findByPk(id);
        
        if (producto.imagen) {
            const rutaImagen = path.join(process.cwd(), 'src/public/img/productos', producto.imagen);
            await fs.unlink(rutaImagen).catch(() => {});
        }

        await Productos.destroy({ where: { id } });
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error al eliminar');
    }
};

// --- Categorías ---
// formulario de categorias 
const getFormCategoria = async (req, res) => {
    try {
        res.render('formCategoria')
    } catch (error) {
        console.error('Error al cargar el formulario de categorias', error);
        res.status(500).send('Error al cargar el formulario de categorias');
        
    }
}
//guardar categorias
const saveCategoria = async (req, res) => {
    try {
        const { nombre } = req.body
        await Categoria.create({nombre})
        res.redirect('/crear-producto')
    } catch (error) {
        console.error('Error al guardar categoria', error);
        res.status(500).send('Error al guardar categiria')

    }
}


export {
    home,
    getFormCategoria,
    saveCategoria ,
    getFormProducto,
    saveProducto,
    deleteProducto,
    getFormEditarProducto,
    updateProducto,
    getAuth
}