import fs from 'fs'

class ProductManager {
    constructor(path) {
        this.path = path
        this.products = []
    }

    static id = 0

    addProduct = async (productToAdd) => {
        if(fs.existsSync(this.path)) {
            const search = this.products.find(product => product.code === productToAdd.code)
    
            if(search) {
                throw new Error("⚠️  No se pudo agregar el producto. El campo 'code' ya existe.")
    
            } else if(!Object.values(productToAdd).every(field => field !== null && field !== undefined)) {
                throw new Error("⚠️  No se pudo agregar el producto. Faltan campos.")
            } 
        }
        
        this.products.push({ id: ProductManager.id++, ...productToAdd })
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
    }

    getProducts = async () => {
        if(fs.existsSync(this.path)) {
            let response = await fs.promises.readFile(this.path, 'utf-8')
            return JSON.parse(response)
        } else {
            return []
        }
    }

    getProductById = async (id) => {
        let response = await this.getProducts()
        let search = response.find(product => product.id === id)

        if(search) {
            return search
        } else {
            throw new Error(`⚠️  ID: ${id} Not found`)
        }
    }

    updateProduct = async (id, field) => {
        let oldProduct = await this.getProductById(id)

        await this.deleteProduct(id)

        let newProduct = { ...oldProduct, ...field }

        this.products.push(newProduct)
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"))
    }

    deleteProduct = async (id) => {
        let filter = this.products.filter(product => product.id !== id)

        if(filter.length === this.products.length) {
            throw new Error(`⚠️  ID: ${id} Not found`)
        }

        await fs.promises.writeFile(this.path, JSON.stringify(filter, null, "\t"))

        this.products = await this.getProducts()
    }
}


// ---------- TESTS ----------
const ProductMngr = new ProductManager('./products.json')


console.log("✅ Array vacio")
console.log(await ProductMngr.getProducts(), "\n")


let productToAdd = {
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25
}

try {
    await ProductMngr.addProduct(productToAdd)
    console.log("✅ Agrego un producto \n")

    console.log("❔ Intento agregarlo de nuevo")
    await ProductMngr.addProduct(productToAdd)
} catch (error) {
    console.error(error.message)
}

console.log("\n✅ Array con un producto")
console.log(await ProductMngr.getProducts(), "\n")



try {
    console.log("✅ Busqueda exitosa de un producto")
    console.log(await ProductMngr.getProductById(0))
    
    console.log("\n❔ Busco un producto que no existe")
    console.log(await ProductMngr.getProductById(3))

} catch (error) {
    console.error(error.message)
}



try {
    console.log("\n✅ Modifico un producto")
    await ProductMngr.updateProduct(0, { title: "Producto modificado" })
    console.log(await ProductMngr.getProducts())
} catch (error) {
    console.error(error.message)
}



try {
    console.log("\n✅ Elimino un producto")
    await ProductMngr.deleteProduct(0)
    console.log(await ProductMngr.getProducts())
    
    console.log("\n❔ Intento eliminar un producto que no existe")
    await ProductMngr.deleteProduct(1)
    
} catch (error) {
    console.log(error.message)
}

