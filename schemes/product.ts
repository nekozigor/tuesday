import { uuidv7, z } from "zod";
import { categorySchema } from "./category";

export const productSchema = z.object({
    id: uuidv7(),
    title: z
        .string()
        .min(2, "Title must be at least 2 characters")
        .max(255, "Title must be at most 255 characters"),
    category: categorySchema,
});

export type productType = z.infer<typeof productSchema>;

export const productCreateSchema = productSchema.omit({id: true});

export type productCreateType = z.infer<typeof productCreateSchema>;