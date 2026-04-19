import express from 'express'
import session from 'express-session';
import fileUpload from 'express-fileupload';
import exphbs from 'express-handlebars'
import { setupPrimary } from 'node:cluster';
import mordiskoRoter from './routes/mordiskoRoutes.js'
import db from './config/db.js'
import path from 'path'

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 4007;

// 1. Middlewares 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//configuracion de Express-fileUpload
app.use(fileUpload({
    createParentPath: true, 
    limits: { fileSize: 2 * 1024 * 1024 }, // Límite de 2MB
    abortOnLimit: true,
    responseOnLimit:"El tamaño del archivo ha superado el limite permitido"
}));

//  Archivos estáticos
app.use(express.static(path.join(process.cwd(), 'src', 'public')));

// Configuración de Sesión (DEBE ir antes de las rutas)
app.use(session({
    secret: 'mordisko-key-2026',
    resave: false,
    saveUninitialized: false
}));

// Pasar sesión a las vistas (res.locals)
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Handlebars
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));

app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    layoutDir: path.join(__dirname, "src/views/layouts"),
    extname: ".hbs",
   
    helpers: {
      eq: (a, b) => a === b
    }
  }),
);
// DB Connection
async function startServer() {
    try {
        await db.authenticate();
        await db.sync({ alter: true }); // <--- Esto es lo que te salvará el Home
        console.log('Conexión a la DB lista');
        
        app.listen(4007, () => {
            console.log('Servidor en puerto 4007');
        });
    } catch (error) {
        console.error('No se pudo conectar:', error);
    }
}

startServer();

// Rutas (Siempre al final)
app.use('/', mordiskoRoter);

app.listen(PORT, () => {
    console.log(`🤖 Server is running on http://localhost:${PORT}`);
});