import { promises as fs} from 'fs';
import { nanoid } from 'nanoid';

class ProductManager{
    constructor (){
        this.path = "src/models/products.json";
    };

    readProducts = async ()=>{  // metodo lectura de los archivos
        let products = await fs.readFile(this.path, "utf-8")
        return JSON.parse(products);
    };

    writeProducts = async (product) => { //metodo para escribir 
        await fs.writeFile(this.path, JSON.stringify(product));

    };
    
    exist = async (id) => {
        let products=  await this.readProducts();
        return products.find(prod => prod.id === id);
    };

    addProducts = async (product)=>{
        let productsOld = await this.readProducts();
        product.id = nanoid();
        let productAll = [...productsOld, product];
        await this.writeProducts(productAll);
        return "Producto agregado correctamente";
    };

    getProducts = async ()=>{
        return await this.readProducts();
    };

    getProductsById = async (id)=>{
        let productById = await this.exist(id);
        if (!productById) return "Producto no encontrado";
        return productById;
    };


    updateProducts = async (id, product) => {
        let productById = await this.exist(id);
        if (!productById) return "Producto no encontrado";
        await this.deleteProducts(id);
        let productOld = await this.readProducts();
        let products = [{...product, id : id, ...productOld}]; //nos devuelve un objeto con el contenido actualizado
        await this.writeProducts(products);
        return "Producto actualizado correctamente";
    };
    
    deleteProducts = async (id) => {
        let products=  await this.readProducts();
        let existProducts = products.some(prod => prod.id === id); //some devuelve true/false buscando por id el prod
            if (existProducts) {
            let filterProducts = products.filter(prod => prod.id != id);//filtro para que me devuelva el nuevo array sin el producto
            await this.writeProducts(filterProducts)
            return "Producto Eliminado"
        } 
        return "Producto a eliminar inexistente";
    }

}

export default ProductManager;