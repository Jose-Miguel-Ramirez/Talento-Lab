import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, RegisterSchemaType } from '@/schemas/auth';

export function useRegister() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const { control, handleSubmit, watch, formState: { errors }, trigger } = useForm<RegisterSchemaType>({
        resolver: zodResolver(RegisterSchema),
        mode: 'onBlur',
        defaultValues: {
            firstName: '',
            middleName: '',
            lastName: '',
            secondLastName: '',
            email: '',
            password: '',
            phoneNumber: '',
            userType: 'client',
            profession: '',
            experience: '',
            bio: '',
        },
    });

    const userType = watch('userType');
    const totalSteps = userType === 'talent' ? 3 : 2;

    const validateStep = async (step: number): Promise<boolean> => {
        let fieldsToValidate: (keyof RegisterSchemaType)[] = [];

        if (step === 1) {
            fieldsToValidate = ['userType'];
        } else if (step === 2) {
            fieldsToValidate = ['firstName', 'lastName', 'email', 'phoneNumber', 'password'];
        } else if (step === 3 && userType === 'talent') {
            fieldsToValidate = ['profession', 'experience'];
        }

        return await trigger(fieldsToValidate);
    };

    const handleNext = async () => {
        const isValid = await validateStep(currentStep);
        if (isValid && currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const onSubmit = async (data: RegisterSchemaType) => {
        setIsSubmitting(true);
        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        first_name: data.firstName,
                        middle_name: data.middleName || '',
                        last_name: data.lastName,
                        second_last_name: data.secondLastName || '',
                        phone: data.phoneNumber,
                        user_type: data.userType,
                        profession: data.profession || '',
                        experience: data.experience || '',
                        bio: data.bio || '',
                    },
                },
            });

            if (authError) throw authError;

            const userId = authData.user?.id;
            if (!userId) throw new Error('No se pudo crear el usuario');

            // Profiles creation logic
            const { error: profileError } = await supabase.from('profiles').insert({
                id: userId,
                email: data.email,
                first_name: data.firstName,
                middle_name: data.middleName || '',
                last_name: data.lastName,
                second_last_name: data.secondLastName || '',
                phone: data.phoneNumber,
                user_type: data.userType,
            });

            if (profileError) console.error('Profile error:', profileError);

            if (data.userType === 'talent') {
                await supabase.from('talent_profiles').insert({
                    id: userId,
                    profession: data.profession || '',
                    experience: data.experience || '',
                    bio: data.bio || '',
                });
            } else {
                await supabase.from('client_profiles').insert({ id: userId });
            }

            Alert.alert(
                '¡Registro Exitoso!',
                'Tu cuenta ha sido creada correctamente.',
                [{ text: 'Continuar', onPress: () => router.replace('/(tabs)') }]
            );
        } catch (error: any) {
            let message = error.message || 'No se pudo completar el registro.';
            if (message.includes('already registered')) {
                message = 'Este correo ya está registrado. Intenta iniciar sesión.';
            }
            Alert.alert('Error de Registro', message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        control,
        errors,
        isSubmitting,
        currentStep,
        totalSteps,
        userType,
        handleNext,
        handlePrevious,
        handleRegister: handleSubmit(onSubmit),
        watch,
    };
}
