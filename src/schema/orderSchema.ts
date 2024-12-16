import z from "zod";
import { SaleDetailSchema } from "./saleDetailSchema";

const OrderSchema = z.object({
    _id: z.string(),
    dateOfSale: z.string(),
    saleDetails: z.array(SaleDetailSchema),
    totalSale: z.number().min(0),
})

export { OrderSchema }