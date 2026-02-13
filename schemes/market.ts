import { uuidv7, z } from "zod";

export const marketSchema = z.object({
    id: uuidv7(),
    title: z
        .string()
        .min(2, "Title must be at least 2 characters")
        .max(255, "Title must be at most 255 characters"),
});

export type marketType = z.infer<typeof marketSchema>;

export const marketCreateSchema = marketSchema.omit({'id': true});

export type marketCreateType = z.infer<typeof marketCreateSchema>;