import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { StepIndicator } from '@/components/auth/StepIndicator'; // You might need to adjust imports if you put it elsewhere
import { useRegister } from '@/hooks/auth/useRegister';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Controller } from 'react-hook-form';

const PROFESSIONS = [
    'Carpintero', 'Electricista', 'Plomero', 'Albañil', 'Pintor',
    'Mecánico', 'Jardinero', 'Técnico HVAC', 'Soldador', 'Ceramista', 'Otro',
];

export default function RegisterScreen() {
    const router = useRouter();
    const {
        control,
        errors,
        isSubmitting,
        currentStep,
        totalSteps,
        userType,
        handleNext,
        handlePrevious,
        handleRegister,
        watch
    } = useRegister();

    const renderStep1 = () => (
        <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
            <View style={styles.stepHeader}>
                <ThemedText style={styles.stepTitle}>¿Cómo quieres usar TalentoLab?</ThemedText>
                <ThemedText style={styles.stepSubtitle}>Selecciona el tipo de cuenta ideal para ti</ThemedText>
            </View>

            <Controller
                control={control}
                name="userType"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.cardSelectContainer}>
                        {/* Talent Option */}
                        <TouchableOpacity
                            style={[styles.cardOption, value === 'talent' && styles.cardOptionActive]}
                            onPress={() => onChange('talent')}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={value === 'talent' ? ['#0F172A', '#1E3A8A'] : ['#F8FAFC', '#F8FAFC']}
                                style={styles.cardGradient}
                            >
                                <View style={[styles.iconContainer, value === 'talent' ? { backgroundColor: 'rgba(255,255,255,0.1)' } : { backgroundColor: '#E2E8F0' }]}>
                                    <IconSymbol name="wrench.and.screwdriver.fill" size={28} color={value === 'talent' ? '#FBBF24' : '#64748B'} />
                                </View>
                                <ThemedText style={[styles.cardTitle, value === 'talent' && styles.textWhite]}>Soy Talento</ThemedText>
                                <ThemedText style={[styles.cardDesc, value === 'talent' && styles.textWhiteOpacity]}>Ofrezco mis servicios profesionales</ThemedText>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Client Option */}
                        <TouchableOpacity
                            style={[styles.cardOption, value === 'client' && styles.cardOptionActive]}
                            onPress={() => onChange('client')}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={value === 'client' ? ['#0F172A', '#1E3A8A'] : ['#F8FAFC', '#F8FAFC']}
                                style={styles.cardGradient}
                            >
                                <View style={[styles.iconContainer, value === 'client' ? { backgroundColor: 'rgba(255,255,255,0.1)' } : { backgroundColor: '#E2E8F0' }]}>
                                    <IconSymbol name="briefcase.fill" size={28} color={value === 'client' ? '#FBBF24' : '#64748B'} />
                                </View>
                                <ThemedText style={[styles.cardTitle, value === 'client' && styles.textWhite]}>Soy Cliente</ThemedText>
                                <ThemedText style={[styles.cardDesc, value === 'client' && styles.textWhiteOpacity]}>Busco profesionales confiables</ThemedText>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </Animated.View>
    );

    const renderStep2 = () => (
        <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
            <View style={styles.stepHeader}>
                <ThemedText style={styles.stepTitle}>Información Personal</ThemedText>
                <ThemedText style={styles.stepSubtitle}>Cuéntanos un poco sobre ti</ThemedText>
            </View>

            <View style={styles.inputRow}>
                <View style={{ flex: 1 }}>
                    <AuthInput control={control} name="firstName" label="Nombre *" icon="person.fill" placeholder="Juan" error={errors.firstName?.message} />
                </View>
                <View style={{ width: 12 }} />
                <View style={{ flex: 1 }}>
                    <AuthInput control={control} name="lastName" label="Apellido *" icon="person.fill" placeholder="Pérez" error={errors.lastName?.message} />
                </View>
            </View>

            <AuthInput control={control} name="email" label="Correo Electrónico *" icon="envelope.fill" placeholder="juan@ejemplo.com" keyboardType="email-address" autoCapitalize="none" error={errors.email?.message} />
            <AuthInput control={control} name="phoneNumber" label="Teléfono *" icon="phone.fill" placeholder="99999999" keyboardType="phone-pad" error={errors.phoneNumber?.message} />
            <AuthInput control={control} name="password" label="Contraseña *" icon="lock.fill" placeholder="••••••••" isPassword error={errors.password?.message} />
        </Animated.View>
    );

    const renderStep3 = () => (
        <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
            <View style={styles.stepHeader}>
                <ThemedText style={styles.stepTitle}>Tu Perfil Profesional</ThemedText>
                <ThemedText style={styles.stepSubtitle}>Destaca tus habilidades</ThemedText>
            </View>

            <Controller
                control={control}
                name="profession"
                render={({ field: { onChange, value } }) => (
                    <View style={{ marginBottom: 20 }}>
                        <ThemedText style={styles.label}>Profesión *</ThemedText>
                        <View style={styles.chipsContainer}>
                            {PROFESSIONS.map((prof) => (
                                <TouchableOpacity
                                    key={prof}
                                    style={[styles.chip, value === prof && styles.chipActive]}
                                    onPress={() => onChange(prof)}
                                >
                                    <ThemedText style={[styles.chipText, value === prof && styles.chipTextActive]}>{prof}</ThemedText>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {errors.profession && <ThemedText style={styles.errorText}>{errors.profession.message}</ThemedText>}
                    </View>
                )}
            />

            <AuthInput control={control} name="experience" label="Experiencia *" icon="clock.fill" placeholder="Ej: 5 años" error={errors.experience?.message} />
            <AuthInput control={control} name="bio" label="Biografía" icon="text.alignleft" placeholder="Cuéntanos brevemente sobre tu experiencia..." multiline numberOfLines={3} style={{ height: 80, textAlignVertical: 'top' }} />
        </Animated.View>
    );

    return (
        <AuthLayout>
            <View style={styles.header}>
                <ThemedText style={styles.headerTitle}>Crear Cuenta</ThemedText>
                <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
            </View>

            <View style={styles.card}>
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}

                <View style={styles.navigationButtons}>
                    {currentStep > 1 && (
                        <View style={{ flex: 1, marginRight: 12 }}>
                            <AuthButton title="Anterior" onPress={handlePrevious} variant="outline" />
                        </View>
                    )}

                    <View style={{ flex: 1 }}>
                        <AuthButton
                            title={currentStep === totalSteps ? 'Registrarse' : 'Siguiente'}
                            onPress={currentStep === totalSteps ? handleRegister : handleNext}
                            isLoading={isSubmitting}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.loginLinkContainer} onPress={() => router.push('/login')}>
                    <ThemedText style={styles.loginText}>¿Ya tienes cuenta? <ThemedText style={styles.loginLink}>Inicia sesión</ThemedText></ThemedText>
                </TouchableOpacity>
            </View>
        </AuthLayout>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.brand.darkBlue,
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 4,
    },
    stepHeader: {
        marginBottom: 24,
    },
    stepTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 4,
    },
    stepSubtitle: {
        fontSize: 14,
        color: '#64748B',
    },
    cardSelectContainer: {
        gap: 16,
    },
    cardOption: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
    },
    cardOptionActive: {
        borderColor: Colors.brand.darkBlue,
        transform: [{ scale: 1.02 }],
    },
    cardGradient: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
    },
    cardDesc: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 2,
    },
    textWhite: {
        color: '#fff',
    },
    textWhiteOpacity: {
        color: 'rgba(255,255,255,0.8)',
    },
    inputRow: {
        flexDirection: 'row',
        gap: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 8,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    chipActive: {
        backgroundColor: Colors.brand.darkBlue,
        borderColor: Colors.brand.darkBlue,
    },
    chipText: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },
    chipTextActive: {
        color: '#fff',
    },
    errorText: {
        color: '#EF4444',
        fontSize: 12,
        marginTop: 4,
    },
    navigationButtons: {
        flexDirection: 'row',
        marginTop: 32,
        gap: 12,
    },
    loginLinkContainer: {
        marginTop: 24,
        alignItems: 'center',
    },
    loginText: {
        color: '#64748B',
        fontSize: 14,
    },
    loginLink: {
        color: Colors.brand.orange,
        fontWeight: '700',
    },
});
