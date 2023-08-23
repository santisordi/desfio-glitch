import { promises as fs} from 'fs';
import { nanoid } from 'nanoid';
import ProductManager from './ProductManager.js';

const productAll = new ProductManager(); //con esto podemos usar todos los metodos del PM


class CartManager {
    constructor(){
        this.path = "./src/models/carts.json"
    }
    
    readCarts = async ()=>{  // metodo lectura de los archivos
        let carts = await fs.readFile(this.path, "utf-8")
        return JSON.parse(carts);
    };
    writeCarts = async (carts) => { //metodo para escribir 
        await fs.writeFile(this.path, JSON.stringify(carts));
    
    };

    exist = async (id) => {
        let carts=  await this.readCarts();
        return carts.find(cart => cart.id === id);
    };

    addCarts = async () => {
        let cartsOld = await this.readCarts();
        let id = nanoid();
        let cartsConcat = [{id : id, products : []}, ...cartsOld];
        await this.writeCarts(cartsConcat);
        return "Carrito Agregado";

    };

    getCartsById = async (id)=>{
        let cartsById = await this.exist(id);
        if (!cartsById) return "Carrito no encontrado";
        return cartsById;
    };

    addProductInCart = async (cartId, productId) => {
        let cartById = await this.exist(cartId);
        if (!cartById) return "Carrito no encontrado";
    
        let productById = await productAll.exist(productId);
        if (!productById) return "Producto no encontrado";
    
        let cartsAll = await this.readCarts();
        let cartIndex = cartsAll.findIndex(cart => cart.id === cartId);
    
        if (cartIndex !== -1) {
            let cart = cartsAll[cartIndex];
            let productIndex = cart.products.findIndex(prod => prod.id === productId);
    
            if (productIndex !== -1) {
                cart.products[productIndex].cantidad++;
                await this.writeCarts(cartsAll);
                return "Producto sumado al carrito";
            } else {
                cart.products.push({ id: productById.id, cantidad: 1 });
                await this.writeCarts(cartsAll);
                return "Producto agregado al carrito";
            };
        };
    
        return "Carrito no encontrado";
    };
    

};

export default CartManager;
