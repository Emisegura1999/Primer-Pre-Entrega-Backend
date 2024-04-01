import fs from "fs/promises";

class ProductManager {
  static ultId = 0;

  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
    try {
        const arrayProductos = await this.leerArchivo();

        if (!title || !description || !price || !code || !stock || !category) {
            throw new Error("Todos los campos son obligatorios");
        }

        if (arrayProductos.some(item => item.code === code)) {
            throw new Error("El código debe ser único");
        }

        const newProduct = {
            title,
            description,
            price,
            img,
            code,
            stock,
            category,
            status: true,
            thumbnails: thumbnails || []
        };

        if (arrayProductos.length > 0) {
            ProductManager.ultId = arrayProductos.reduce((maxId, product) => Math.max(maxId, parseInt(product.id)), 0);
        }

        // Convertir el ID a cadena de texto
        newProduct.id = String(++ProductManager.ultId);

        arrayProductos.push(newProduct);
        await this.guardarArchivo(arrayProductos);
    } catch (error) {
        console.log("Error al agregar producto", error);
        throw error; 
    }
}


  async getTecnologia() {
    try {
      const arrayProductos = await this.leerArchivo();
      return arrayProductos;
    } catch (error) {
      console.log("Error al leer el archivo", error);
      throw error;
    }
  }

  async getTecnologiaById(id) {
    try {
      const arrayProductos = await this.leerArchivo();
      const buscado = arrayProductos.find(item => item.id === id);

      if (!buscado) {
        throw new Error("Producto no encontrado");
      }

      return buscado;
    } catch (error) {
      console.log("Error al leer el archivo", error);
      throw error;
    }
  }

  async getTecnologiaLimited(limit) {
    try {
      const arrayProductos = await this.leerArchivo();
      if (isNaN(limit) || limit < 0) {
        throw new Error("El límite debe ser un número positivo");
      }
      return arrayProductos.slice(0, limit);
    } catch (error) {
      console.log("Error al obtener los productos limitados", error);
      throw error;
    }
}

  async leerArchivo() {
    try {
      const respuesta = await fs.readFile(this.path, "utf-8");
      const arrayProductos = JSON.parse(respuesta);
      return arrayProductos;
    } catch (error) {
      console.log("Error al leer un archivo", error);
      throw error;
    }
  }

  async guardarArchivo(arrayProductos) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    } catch (error) {
      console.log("Error al guardar el archivo", error);
      throw error;
    }
  }

  async updateTecnologia(id, productoActualizado) {
    try {
        const arrayProductos = await this.leerArchivo();

        const index = arrayProductos.findIndex(item => item.id === String(id)); // Convertir id a string para la comparación

        if (index !== -1) {
            arrayProductos[index] = { ...arrayProductos[index], ...productoActualizado };
            await this.guardarArchivo(arrayProductos);
            console.log("Producto actualizado");
        } else {
            console.log("No se encontró el producto");
        }
    } catch (error) {
        console.log("Error al actualizar el producto", error);
        throw error;
    }
}


  async deleteTecnologia(id) {
    try {
      const arrayProductos = await this.leerArchivo();

      const index = arrayProductos.findIndex(item => item.id === id);

      if (index !== -1) {
        arrayProductos.splice(index, 1);
        await this.guardarArchivo(arrayProductos);
        console.log("Producto eliminado");
      } else {
        console.log("No se encontró el producto");
      }
    } catch (error) {
      console.log("Error al eliminar el producto", error);
      throw error;
    }
  }
}

export default ProductManager;
