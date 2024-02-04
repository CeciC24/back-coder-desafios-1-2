class ProductManager {
    constructor() {
        this.products = []
    }

    static id = 0

    addProduct(title, description, price, thumbnail, code, stock) {
        const search = this.products.find(product => product.code === code)

        if(search) {
            throw new Error("El campo 'code' ya existe")
        } else if(!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error("Faltan campos")
        }

        this.products.push({ title, description, price, thumbnail, code, stock, id: ProductManager.id++ })
    }

    getProducts() {
        return this.products
    }

    getProductById(id) {
        let search = this.products.find(product => product.id === id)

        if(search) {
            return search
        } else {
            console.log("Not found")
        }
    }
}



let productManager = new ProductManager()

// Array vacio
console.log(productManager.getProducts())

productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)

// Array con un producto
console.log(productManager.getProducts())

// Error por codigo repetido
/* productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25) */

// Error por faltar campos
/* productManager.addProduct("producto prueba", 200, "Sin imagen", "abc123", 25) */

// Encuentra el producto
console.log("Producto encontrado:", productManager.getProductById(0))

// No encuentra el producto
console.log(productManager.getProductById(3))