import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useLogin } from '@/hooks/auth/useLogin';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function LoginScreen() {
    const { control, errors, isLoading, handleLogin } = useLogin();

    return (
        <AuthLayout>
            <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.header}>
                <Image
                    source={require('@/assets/images/logo.png')}
                    style={styles.logo}
                    contentFit="contain"
                />
                <ThemedText style={styles.title}>Bienvenido de nuevo</ThemedText>
                <ThemedText style={styles.subtitle}>Ingresa a tu cuenta para continuar</ThemedText>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200).duration(600).springify()} style={styles.formCard}>
                <AuthInput
                    control={control}
                    name="email"
                    label="Correo Electrónico"
                    icon="envelope.fill"
                    placeholder="ejemplo@correo.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={errors.email?.message}
                />

                <AuthInput
                    control={control}
                    name="password"
                    label="Contraseña"
                    icon="lock.fill"
                    placeholder="••••••••"
                    isPassword
                    error={errors.password?.message}
                />

                <TouchableOpacity style={styles.forgotPassword}>
                    <ThemedText style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</ThemedText>
                </TouchableOpacity>

                <View style={styles.buttonContainer}>
                    <AuthButton
                        title="Ingresar"
                        onPress={handleLogin}
                        isLoading={isLoading}
                    />
                </View>

                <View style={styles.divider}>
                    <View style={styles.line} />
                    <ThemedText style={styles.dividerText}>o</ThemedText>
                    <View style={styles.line} />
                </View>

                <View style={styles.registerContainer}>
                    <ThemedText style={styles.registerText}>¿No tienes cuenta? </ThemedText>
                    <Link href={"/register" as any} asChild>
                        <TouchableOpacity>
                            <ThemedText style={styles.registerLink}>Regístrate aquí</ThemedText>
                        </TouchableOpacity>
                    </Link>
                </View>
            </Animated.View>
        </AuthLayout>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logo: {
        width: 180,
        height: 60,
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.brand.darkBlue,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
    },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        shadowColor: Colors.brand.darkBlue,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 5,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: Colors.brand.orange,
        fontSize: 14,
        fontWeight: '600',
    },
    buttonContainer: {
        marginTop: 8,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#E2E8F0',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#94A3B8',
        fontSize: 14,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 8,
    },
    registerText: {
        color: '#64748B',
        fontSize: 14,
    },
    registerLink: {
        color: Colors.brand.orange,
        fontSize: 14,
        fontWeight: '700',
    },
});
