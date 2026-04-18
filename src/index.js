import express from 'express'
import exphbs from 'express-handlebars'
import mordiskoRoter from './routes/mordiskoRoutes.js'
import db from './config/db.js'
import path from 'path'


const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 4007;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static
app.use(express.static(path.join(__dirname, 'src/public')))

// DB
const connectDB = async () => {
    try {
        await db.sync()
        console.log('conexion exitosa a la base de datos')
    } catch (error) {
        console.error('Error al conectar con base de datos', error)
    }
}
connectDB()

// handlebars
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));

app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    layoutDir: path.join(__dirname, "src/views/layouts"),
    extname: ".hbs",
  }),
);

// rutas
app.use('/', mordiskoRoter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});