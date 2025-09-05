const authorization = (role) => {
    return async (req, res, next) => {
        console.log('Authorization middleware reached');
        console.log('User:', req.user);  // Verifica si req.user está correctamente configurado

        if (!req.user) return res.status(401).send(({ status: 'error', error: 'Unauthorized' }));

        if (req.user.role != role) return res.status(403).send({ status: 'error', error: "FORBIDDEN" });

        next();
    }
}

export default authorization;