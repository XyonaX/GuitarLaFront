import z from 'zod'

const SaleDetailSchema = z.object({
    idProduct: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0)
})

export { SaleDetailSchema }