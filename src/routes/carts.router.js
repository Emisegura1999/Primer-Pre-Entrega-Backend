import express from "express";
import CartManager from '../controllers/cart-manager.js';

const router = express.Router();
const cartManager = new CartManager("./src/models/carrito.json");

router.use(express.json());

//1) Creamos un nuevo carrito:
router.post('/', async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        console.error('Error al crear un nuevo carrito:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//2) Listamos productos que pertenecen a un carrito determinado
router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const carrito = await cartManager.getCarritoById(cartId);
        if (!carrito) {
            res.status(404).send('Carrito no encontrado');
        } else {
            res.json(carrito.products);
        }
    } catch (error) {
        console.error('Error al obtener productos por ID de carrito:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//3) Agregar productos a distintos carritos: 
router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1; 

    try {
        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId,productId, quantity);
        res.json(actualizarCarrito.products);
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
