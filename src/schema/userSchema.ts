import z from "zod";

const UserSchema = z.object({
    _id: z.string().optional(), // El ID será opcional porque no está disponible al crear un nuevo usuario
    username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
    email: z.string().email("Debe ser un email válido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional().nullable(),
    fullName: z.string().min(3, "El nombre completo debe tener al menos 3 caracteres"),
    dateOfBirth: z.string().optional().nullable(), // Fecha de nacimiento como string ISO (opcional)
    phone: z.string().optional().nullable(), // Teléfono (opcional)
    address: z.string().optional().nullable(), // Dirección (opcional)
    role: z.enum(["admin", "user"]).default("user"), // Enum para roles
    status: z.enum(["activo", "inactivo"]).default("activo"), //Estado del usuario 
    createdAt: z.string().optional(), // Fecha de creación como string ISO (opcional)
});

export { UserSchema };
