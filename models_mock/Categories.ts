import { categoryType } from "@/schemes/category";
import Mock from "./Mock";
import { foodData } from "./FakeData";

export default class Categories extends Mock<categoryType> {

    generateData(): categoryType[] {

        let data: categoryType[] = []

        foodData.forEach(food => {
            data.push({
                id: this.uuid(),
                title: food.title,
            })
        })

        return data
    }
}