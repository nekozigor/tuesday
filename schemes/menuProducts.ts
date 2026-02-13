import { z } from "zod";
import { categorySchema } from "./category";

export const menuProductSchema = z.object({
    id: z.uuidv7(),
    title: z.string(),
    price: z
        .coerce
        .number()
        .refine(
            (val) => {
                const parts = val.toString().split(".");
                return parts.length !== 2 || parts[1].length <= 2;
            },
            { message: "Максимум 2 знака после запятой" }
        )
        .nonnegative("Цена должна быть больше 0")
        .default(0),
    added: z.boolean(),
    fieldIndex: z.number(),
    category: categorySchema,    
});

export const menuProductsSchema = z.object({
    id: z.uuidv7(),
    title: z.string(),
    products: z.array(menuProductSchema)
});

export type menuProductType = z.infer<typeof menuProductSchema>;
export type menuProductsType = z.infer<typeof menuProductsSchema>;