import { uuidv7, z } from "zod";

export const categorySchema = z.object({
    id: uuidv7(),
    title: z
        .string()
        .min(2, "Title must be at least 2 characters")
        .max(255, "Title must be at most 255 characters"),
});

export type categoryType = z.infer<typeof categorySchema>;

export const categoryCreateSchema = categorySchema.omit({'id': true});

export type categoryCreateType = z.infer<typeof categoryCreateSchema>;