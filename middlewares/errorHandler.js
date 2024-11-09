const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({
      message: 'Error en el servidor',
      error: err.message,
    });
  };
  
  module.exports = errorHandler;
  