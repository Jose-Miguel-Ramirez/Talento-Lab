import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginSchemaType } from '@/schemas/auth';

export function useLogin() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = async (data: LoginSchemaType) => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (error) throw error;

            router.replace('/(tabs)');
        } catch (error: any) {
            let message = error.message || 'No se pudo iniciar sesión.';
            if (message.includes('Invalid login credentials')) {
                message = 'Correo o contraseña incorrectos. Por favor verifícalos.';
            }
            Alert.alert('Error de Inicio de Sesión', message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        control,
        errors,
        isLoading,
        handleLogin: handleSubmit(onSubmit),
    };
}
