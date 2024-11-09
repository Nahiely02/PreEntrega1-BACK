const mongoose = require('mongoose'); // Importación de mongoose

// conectar a la base de datos MongoDB
const connectToMongoDB = async () => {
  try {
    // Intentar conectar a MongoDB usando la URI desde las variables de entorno
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,  // Usar el nuevo analizador de URL
      useUnifiedTopology: true,  
    });
    console.log('MongoDB connected...');
  } catch (err) {
    // En caso de error, mostrar el mensaje de error 
    console.error(err.message);
    process.exit(1);  // Detener la aplicación si no se puede conectar
  }
};

module.exports = connectToMongoDB;  // Exportar la función 
