import Mock from "./Mock";
import { productType } from "@/schemes/product";
import Categories from "./Categories";
import { foodData } from "./FakeData";

export default class Products extends Mock<productType> {

    generateData(): productType[] {

        const categories = Mock.create(Categories).getData();

        let data: productType[] = []

        foodData.forEach(food => {
            let category = categories.find((category) => category.title == food.title);
            category && food.data.forEach(product => {
                data.push({
                    id: this.uuid(),
                    title: product,
                    category: category
                })
            })
        })

        return data
    }
}