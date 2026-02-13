import { marketType } from "@/schemes/market";
import Mock from "./Mock";
import { generateUUID } from "@/lib/uuid";
export default class Market extends Mock<marketType> {

    generateData(): marketType[] {

        let data: marketType[] = []

        data.push({
            id: generateUUID(),
            title: 'Market',
        });

        return data
    }
}