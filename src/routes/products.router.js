import express from "express";
const router = express.Router();
import ProductManager from '../controllers/product-manager.js';

// Crear una instancia del ProductManager
const productManager = new ProductManager("./src/models/Tecnologia.json");

// Middleware para parsear el body de las solicitudes
router.use(express.json());

// Ruta para agregar un producto
router.post('/', async (req, res) => {
    try {
        await productManager.addProduct(req.body);
        res.status(201).json({ message: "Producto agregado exitosamente" });
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await productManager.getTecnologia();
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Ruta para obtener un producto por su ID
router.get('/:pid', async (req, res) => {
    try {
        const id = req.params.pid;
        const producto = await productManager.getTecnologiaById(id); // No necesitas parseInt aquí
        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(producto);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Ruta para obtener productos limitados
router.get('/limited/:limit', async (req, res) => {
    try {
        const limit = parseInt(req.params.limit);
        const productosLimitados = await productManager.getTecnologiaLimited(limit);
        res.json(productosLimitados);
    } catch (error) {
        console.error('Error al obtener los productos limitados:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});



// Ruta para eliminar un producto
router.delete('/:pid', async (req, res) => {
    try {
        const id = req.params.pid;
        await productManager.deleteTecnologia(parseInt(id));
        res.json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Ruta para actualizar un producto
router.put('/:pid', async (req, res) => {
    try {
        const id = req.params.pid;
        const productoActualizado = req.body;
        await productManager.updateTecnologia(parseInt(id), productoActualizado);
        res.json({ message: "Producto actualizado correctamente" });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
