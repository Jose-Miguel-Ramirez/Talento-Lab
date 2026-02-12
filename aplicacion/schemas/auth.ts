import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
    firstName: z.string().min(2, 'El nombre es muy corto'),
    middleName: z.string().optional(),
    lastName: z.string().min(2, 'El apellido es muy corto'),
    secondLastName: z.string().optional(),
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    phoneNumber: z.string().length(8, 'El número debe tener 8 dígitos').regex(/^[2389][0-9]{7}$/, 'Debe ser un número válido de Honduras (8 dígitos)'),
    userType: z.enum(['talent', 'client']),
    // Talent specific fields - optional by default but refined later or checked conditionally
    profession: z.string().optional(),
    experience: z.string().optional(),
    bio: z.string().optional(),
}).refine((data) => {
    if (data.userType === 'talent') {
        return !!data.profession && data.profession.length > 0;
    }
    return true;
}, {
    message: "El oficio es requerido",
    path: ["profession"],
}).refine((data) => {
    if (data.userType === 'talent') {
        return !!data.experience && data.experience.length > 0;
    }
    return true;
}, {
    message: "La experiencia es requerida",
    path: ["experience"],
}).refine((data) => {
    // Bio is optional even for talent? Let's make it optional for now or required if user wants.
    // The user didn't specify strict requirement for bio, but usually it's good.
    // Let's keep it optional to reduce friction, or maybe just a short check if we want.
    return true;
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
