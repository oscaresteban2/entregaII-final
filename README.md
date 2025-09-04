# 🛒 Proyecto de Carrito de Compras con Node.js, Express y Handlebars

Este proyecto es una aplicación web construida con Node.js y Express, que incluye funcionalidades como gestión de carritos de compras, conexión con MongoDB, renderizado con Handlebars.

---

## 🚀 Tecnologías y Librerías Usadas

- **Node.js**
- **Express**
- **MongoDB (con Mongoose)**
- **Handlebars / Express-Handlebars**
- **Multer** – para carga de archivos
- **Socket.IO** – comunicación en tiempo real
- **SweetAlert2** – notificaciones y alertas
- **Dotenv** – manejo de variables de entorno
- **Nodemon** – reinicio automático en desarrollo

---

## 📦 Instalación del Proyecto

1. **Clona el repositorio:**

```bash
git clone https://github.com/oscaresteban2/entrega-final/tree/main
cd el-repositorio
```

2. **Instala las dependencias:**

```bash
npm install
```

3. **Crea un archivo `.env`** en la raíz del proyecto con las variables necesarias:

```env
URI_MONGODB = 'mongodb+srv://oscar:1234@cluster0.cscud.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
PORT = 8080
SECRET=CoderSecret
```

4. **Inicia el servidor en modo desarrollo:**

```bash
npm run dev
```

> Este comando utiliza **Nodemon** para reiniciar el servidor automáticamente ante cambios.

---

## 📁 Scripts disponibles

- `npm run dev`: Inicia el servidor con Nodemon
- `npm start`: Inicia el servidor en producción

---

## ⚠️ Notas importantes

- Asegúrate de tener MongoDB corriendo localmente o usa un URI de MongoDB Atlas.
- Revisa que el archivo `.env` contenga todos los valores requeridos.

---

## 🧪 Librerías instaladas

```json
"dependencies": {
  "bcrypt": "^6.0.0",
        "connect-mongo": "^5.1.0",
        "cookie-parser": "^1.4.7",
        "dotenv": "^16.6.1",
        "express": "^4.21.2",
        "express-handlebars": "^8.0.3",
        "express-session": "^1.18.2",
        "handlebars": "^4.7.8",
        "jsonwebtoken": "^9.0.2",
        "mongoose": "^8.17.1",
        "mongoose-paginate-v2": "^1.9.1",
        "multer": "^1.4.5-lts.1",
        "nodemon": "^3.1.10",
        "passport": "^0.7.0",
        "passport-github2": "^0.1.12",
        "passport-jwt": "^4.0.1",
        "passport-local": "^1.0.0",
        "socket.io": "^4.8.1",
        "socket.oi": "^0.0.1-security.8",
        "sweetalert2": "^11.22.2"
}
```

---

## ✨ Créditos

Desarrollado por **Oscar Peñuela**
