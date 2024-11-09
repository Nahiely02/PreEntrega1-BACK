const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const connectToMongoDB = require('./config/database');  
const authRoutes = require('./routes/auth');
const errorHandler = require('./middlewares/errorHandler');  

dotenv.config();  // Cargar las variables de entorno

const app = express();

// Conectar a la base de datos
connectToMongoDB();  // se llama 

// Middleware
app.use(express.json());  // Para parsear JSON
app.use(cookieParser());  // Para leer cookies
app.use(passport.initialize());  // Inicializar passport

// Rutas
app.use('/api/auth', authRoutes);

// Middleware global de manejo de errores
app.use(errorHandler);

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor cargando en el puerto ${PORT}`));
