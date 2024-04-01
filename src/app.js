import express from "express";
const app = express();
const PUERTO = 8080;

// Importar los routers de productos y carritos
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

// Middleware para manejar JSON y datos complejos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Vinculación de rutas
app.use("/api/products", productsRouter); 
app.use("/api/carts", cartsRouter); 

app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
});
