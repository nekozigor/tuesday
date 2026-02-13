import { menuProductsType, menuProductType } from "@/schemes/menuProducts";

export type productListType = {
    id: string,
    title: string,
    index: number,
    data: menuProductType[]
}

export class MenuSelectList{

    static convertProductsToList(menuProduct: menuProductsType|undefined): productListType[]{
        if (menuProduct == undefined){
            return []
        }
        
        let arr: any = {};
        let i = 0;
        menuProduct.products?.forEach((product) => {
            if (arr[product.category.id]){
                arr[product.category.id].data.push(product);
            } else {
                arr[product.category.id] = {
                    id: product.category.id,
                    index: i++,
                    title: product.category.title,
                    data: [product]
                }
            }
        })

        return Object.values(arr)
    }

    static getHeaderIndex(data: productListType[] | undefined): CallableFunction{
        const header: number[] = [];
        data ??= [];
        for (const [index, item] of data.entries()) {
            for (const _ of item.data) {
                header.push(index); 
            }
        }

        return (index: number) => header[index] ?? header[header.length - 1];
    }
}