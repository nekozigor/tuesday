import { menuType } from "@/schemes/menu";
import { menuProductsType, menuProductType } from "@/schemes/menuProducts";
import Mock from "./Mock";
import Products from "./Products";
import Menus from "./Menus";

export default class MenuProducts extends Mock<menuProductsType>{

    #products: {[k in menuType['id']]: menuProductsType} = {};

    generateData (): menuProductsType[] {
        return [];
    }

    async getMenuProducts(menuId: menuType['id']): Promise<menuProductsType>{
        const products = Mock.create(Products).getData();
                    
        if (!this.#products[menuId]){
            const menu = await Mock.create(Menus).readOne(menuId);
            let i = 0;
            const menuProduct: menuProductsType = {...menu, products: []}
            products.forEach(
                product => {
                    const added = Math.random() > 0.5;
                    menuProduct.products.push({...product, price: 0, added: added, fieldIndex: i++})
                }
            );
            this.#products[menuId] = menuProduct;
        } else {
            const menu = this.#products[menuId];
            const productsMap = new Set(products.map(p => p.id));
            menu.products = menu.products.filter(p => productsMap.has(p.id));
            const pM = new Set(menu.products.map(p => p.id));
            products.forEach(product => {
                if (!pM.has(product.id)){
                    menu.products.push({...product, price: 0, added: false, fieldIndex: 0});
                }
            });
            let i = 0;
            menu.products = menu.products.map(p => { return {...p, fieldIndex: i++}});
        }

        return this.#products[menuId];
    }

    async generateDataById(id: string): Promise<menuProductsType> {
        return this.getMenuProducts(id);
    }

    async getAddedProducts(id: string): Promise<menuProductsType> {
        const menu = {... await this.getMenuProducts(id)};
        menu.products = menu.products.filter(product => product.added);

        return menu;
    }

    async updateProducts(menuId: menuType['id'], products: menuProductType[]){
        const productsMap = new Map(products.map(p => [p.id, p]));

        this.#products[menuId].products = this.#products[menuId].products.map(product => {
            if (productsMap.has(product.id) && product){
                return {...product, ...productsMap.get(product.id)};
            }

            return product;
        });
    }
}