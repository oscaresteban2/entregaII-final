const executePolicies = (policies) => {
    return (req, res, next) => {
        // Si la ruta es pública, no se requiere autenticación ni roles
        if (policies[0] === "PUBLIC") {
            return next();
        }

        // Si la política es "NO_AUTH" y el usuario está autenticado, redirige
        if (policies[0] === "NO_AUTH") {
            if (!req.user) return next();  // Si no hay usuario, permite el acceso
            return res.sendUnauthorized("Ya estás autenticado");
        }

        // Si la política requiere autenticación, pero el usuario no está autenticado
        if (policies[0] === "AUTH" && !req.user) {
            return res.sendUnauthorized("No se encuentra autenticado");
        }

        // Si el usuario está autenticado, continua con la política "AUTH"
        if (policies[0] === "AUTH" && req.user) {
            return next();
        }

        // Si no hay usuario en la sesión, niega el acceso
        if (!req.user) {
            return res.sendUnauthorized('No se encuentra autenticado');
        }

        // Si el rol del usuario no está permitido, deniega el acceso
        if (policies.length > 0 && !policies.includes(req.user.role.toUpperCase())) {
            return res.sendForbidden('No tiene acceso');
        }

        // Si ninguna de las condiciones previas, permite el acceso
        next();
    }
};

export default executePolicies;
