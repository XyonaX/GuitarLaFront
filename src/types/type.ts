import z from "zod";
import { ProductSchema } from "../schema/productSchema";
import { CartSchema } from "../schema/productSchema";
import { UserSchema } from "../schema/userSchema";
import { BlogSchema } from "../schema/blogSchema";
import { SaleDetailSchema } from "../schema/saleDetailSchema";
import { OrderSchema } from "../schema/orderSchema";


export type ProductType = z.infer<typeof ProductSchema>;
export type CartType = z.infer<typeof CartSchema>;
export type UserType = z.infer<typeof UserSchema>;
export type BlogType  = z.infer<typeof BlogSchema>;
export type SaleDetail = z.infer<typeof SaleDetailSchema>;
export type Order = z.infer<typeof OrderSchema>;
