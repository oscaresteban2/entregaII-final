import jwt from 'jsonwebtoken';
import { usersService } from '../services/index.js';
import UserDTO from '../dto/User.js';
import config from '../config/config.js';

const home = async (req, res, next) => {
    try {
        return res.render("home", {
            css: 'home'
        });
    } catch (error) {
        next(error);
    }
}
const getUsers = async (req, res, next) => {
    try {
        const users = await usersService.getUsers();
        const usersInfo = users.map((user) => UserDTO.getTokenDTOFrom(user));
        return res.send({ status: "success", payload: usersInfo });
    } catch (error) {
        next(error);
    }
};

const getUserBy = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const user = await usersService.getUser({ _id: uid });
        if (!user)
            return res.status(404).send({ status: "error", message: "Usuario no encontrado" });
        return res.send({ status: "success", payload: user });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const user = await usersService.getUser({ _id: uid });
        if (!user)
            return res.status(404).send({ status: "error", message: "Usuario no encontrado" });
        const result = await usersService.updateUser(uid, req.body);
        req.logger.info("Usuario actualizado correctamente", { uid });
        return res.send({ status: "success", payload: result });
    } catch (error) {
        req.logger.error("No se pudo realizar la actualizacion", error);
        const customError = new Error();
        const knownError = ErrorsDictionary[error.name];

        if (knownError) {
            customError.name = knownError,
                customError.message = error.message,
                customError.code = errorCodes[knownError];
            next(customError);
        } else {
            next(error);
        }
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const user = await usersService.getUser({ _id: uid });
        if (!user) return res.status(404).send({ status: "error", message: "Usuario no encontrado" });
        await usersService.deleteUser(uid);
        req.logger.info("Usuario eliminado correctamente", { uid });
        return res.send({ status: "success", message: "User deleted successfully" });
    } catch (error) {
        req.logger.error("No fue posible eliminar el usuario", error);
        const customError = new Error();
        const knownError = ErrorsDictionary[error.name];

        if (knownError) {
            customError.name = knownError,
                customError.message = error.message,
                customError.code = errorCodes[knownError];
            next(customError);
        } else {
            next(error);
        }
    }
};

const upgradeUser = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const usersInfo = await usersService.getUser({ _id: uid });
        const user = UserDTO.getTokenDTOFrom(usersInfo);

        if (!user) {
            return res.status(404).send({ status: "error", message: "Usuario no encontrado" });
        }
        if (user.role === "premium") {
            return res.status(400).send({ status: "error", message: "Usuario ya actualizado" });
        }
        if (user.role === "user" && user.isPremium === true) {
            await usersService.updateUser({ _id: uid }, { role: "premium" });
            const tokenizedUser = UserDTO.getTokenDTOFromPremium({ ...user, role: "premium" });
            const token = jwt.sign(tokenizedUser, config.jwt.SECRET, { expiresIn: "1d" });
            res.cookie(config.jwt.COOKIE, token);

            const usersInfoUpdate = await usersService.getUser({ _id: uid });
            const infoUpdateUser = UserDTO.getTokenDTOFrom(usersInfoUpdate);

            return res.status(200).send({ status: "success", message: "Usuario actualizado correctamente", payload: infoUpdateUser });
        }
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        res.render('login', {
            css: 'login'
        })
    } catch (error) {
        next(error);
    }
}
const register = async (req, res, next) => {
    try {
        res.render('register', {
            css: 'register'
        })
    } catch (error) {
        next(error);
    }

}
const profile = async (req, res, next) => {
    try {
        return res.render('profile', {
            css: 'profile'
        });
    } catch (error) {
        next(error);
    }
}

const passwordRestore = async (req, res, next) => {
    try {
        const { token } = req.query;
        if (!token) return res.render('RestorePasswordError', { error: 'Ruta inválida, favor de solicitar un nuevo link de restablecimiento' });
        //El hecho de que me pase un token, NO SIGNIFICA QUE YA SEA VÁLIDO, falta corroborar:
        //1. ¿El token está expirado?
        //2. ¿El token siquiera es válido?
        try {
            jwt.verify(token, config.jwt.SECRET);
            res.render('PasswordRestore', {
                css: 'restore'
            });
        } catch (error) {
            next(error);
            if (error.expiredAt) {
                return res.render('RestorePasswordError', { error: "El link de este correo expiró, favor de solicitar un nuevo correo" });
            }
            res.render('RestorePasswordError', { error: 'Link inválido o corrupto, favor de solicitar un nuevo correo' });
        }
    } catch (error) {
        next(error);
    }

}

const productCreator = async (req, res, next) => {
    try {
        return res.render('productCreator', {
            css: 'productsCreater'
        });
    } catch (error) {
        next(error);
    }
};

const premium = async (req, res, next) => {
    try {
        return res.render('premium', {
            css: 'premium'
        });
    } catch (error) {
        next(error);
    }
};

export default {
    home,
    getUsers,
    getUserBy,
    updateUser,
    deleteUser,
    upgradeUser,
    login,
    passwordRestore,
    register,
    profile,
    productCreator,
    premium
}