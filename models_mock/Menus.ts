import { menuType } from "@/schemes/menu";
import Mock from "./Mock"
import Products from "./Products";

export default class Menus extends Mock<menuType> {

    generateData (): menuType[] {
        const products = Mock.create(Products).getData();
        
        let data: menuType[] = []
        // products.forEach((product) => product.added = Math.floor(Math.random() * 2) ? true : false);

        for (let i = 0; i < 15; i++){
            let r = Math.floor(Math.random() * products.length)
            data.push({
                id: this.uuid(),
                title: 'Menu ' + i,
                status: Math.floor(Math.random() * 2) ? 'inactive' : 'active',
                // products: products.slice(r, r + 3),
                products: products
            })
        }

        return data
    }
}