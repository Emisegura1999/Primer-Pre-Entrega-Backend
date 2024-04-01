import fs from "fs/promises";

class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
        this.ultId = 0;

        this.cargarCarritos();
    }

    async cargarCarritos() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            if (data.trim() !== "") {
                this.carts = JSON.parse(data);
                if (this.carts.length > 0) {
                    this.ultId = Math.max(...this.carts.map(cart => parseInt(cart.id)));
                }
            }
        } catch (error) {
            if (error.code !== 'ENOENT') {
                console.log("Error al crear los carritos: ", error);
                throw error; // Lanzar el error para que se maneje externamente
            }
        }
    }

    async guardarCarritos() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.log("Error al guardar los carritos: ", error);
            throw error; 
        }
    }

    async crearCarrito() {
        try {
            const nuevoCarrito = {
                id: (++this.ultId).toString(), // Convertir a string
                products: []
            };

            this.carts.push(nuevoCarrito); // Añadir al array de carritos

            await this.guardarCarritos();
            return nuevoCarrito;
        } catch (error) {
            console.log("Error al crear un nuevo carrito: ", error);
            throw error; 
        }
    }

    async getCarritoById(carritoId) {
        try {
            const carrito = this.carts.find(c => c.id.toString() === carritoId.toString());

            if (!carrito) {
                console.log("No hay carrito con ese id");
                return;
            }

            return carrito;
        } catch (error) {
            console.log("Error al obtener un carrito por id: ", error);
            throw error; 
        }
    }

    async agregarProductoAlCarrito(carritoId, productoId, quantity = 1) {
        try {
            const carrito = await this.getCarritoById(carritoId);
            const existeProducto = carrito.products.find(p => p.product === productoId);

            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({ product: productoId, quantity });
            }

            await this.guardarCarritos();
            return carrito;
        } catch (error) {
            console.log("Error al agregar producto al carrito: ", error);
            throw error; 
        }
    }
}

export default CartManager;
