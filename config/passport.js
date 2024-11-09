const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../modelos/User');

// Configuración de JWT con extracción desde las cookies
const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),  // Extraer del header
    ExtractJwt.fromCookie('token'),            // Extraer desde la cookie
  ]),
  secretOrKey: process.env.JWT_SECRET,  // Se obtiene de las variables de entorno
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.id);
    if (!user) {
      return done(null, false);  // Usuario no encontrado
    }
    return done(null, user);  // Usuario encontrado
  } catch (error) {
    return done(error, false); 
  }
}));
