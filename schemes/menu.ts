import { uuidv7, z } from "zod";
import { productSchema } from "./product";

export const menuSchema = z.object({
    id: uuidv7(),
    title: z
        .string()
        .min(2, "Title must be at least 2 characters")
        .max(255, "Title must be at most 255 characters"),
    status: z.enum(['active', 'inactive']).optional(),
    products: z.array(productSchema).optional(),
    // categories: z.array(categorySchema).optional(),
});

export type menuType = z.infer<typeof menuSchema>;

export const menuCreateSchema = menuSchema.omit({id: true});

export type menuCreateType = z.infer<typeof menuCreateSchema>;