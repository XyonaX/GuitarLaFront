import z from "zod";

const ProductSchema = z.object({
  _id: z.string(),
  productName: z.string().min(3),
  description: z.string().min(4),
  shortDescription: z.string().min(3),
  price: z.number().min(1),
  isAvailable: z.boolean(),
  stock: z.number().min(0).max(50),
  imageUrl: z.string().nullable(),
});

const CartSchema = ProductSchema.merge(
  z.object({
    quantity: z.number().min(1),
  })
);

export { ProductSchema, CartSchema };
