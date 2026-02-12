import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, useWindowDimensions, Alert } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';

export function NewsletterSection() {
    const [email, setEmail] = useState('');
    const { width } = useWindowDimensions();
    const isSmallScreen = width < 768;

    const handleSubscribe = () => {
        if (!email || !email.includes('@')) {
            Alert.alert('Error', 'Por favor ingresa un correo válido.');
            return;
        }
        // TODO: Implement actual subscription logic
        Alert.alert('¡Suscrito!', 'Gracias por unirte a nuestra comunidad.');
        setEmail('');
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <IconSymbol name="envelope.fill" size={32} color="#0F172A" />
                </View>

                <ThemedText style={styles.title}>Mantente Informado</ThemedText>
                <ThemedText style={styles.subtitle}>
                    Recibe novedades sobre cómo TalentoLab está transformando el mercado de servicios.
                </ThemedText>

                <View style={[styles.form, isSmallScreen ? styles.formColumn : styles.formRow]}>
                    <TextInput
                        style={styles.input}
                        placeholder="tu@email.com"
                        placeholderTextColor="#9CA3AF"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        accessibilityLabel="Dirección de correo electrónico"
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSubscribe}
                        accessibilityRole="button"
                        accessibilityLabel="Suscribirse al boletín"
                    >
                        <ThemedText style={styles.buttonText}>Suscribirse</ThemedText>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 80,
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    content: {
        backgroundColor: '#EFF6FF',
        borderRadius: 32,
        padding: 48,
        alignItems: 'center',
        maxWidth: 800,
        width: '100%',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 32,
        maxWidth: 500,
        lineHeight: 24,
    },
    form: {
        width: '100%',
        maxWidth: 500,
        gap: 12,
    },
    formRow: {
        flexDirection: 'row',
    },
    formColumn: {
        flexDirection: 'column',
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        color: '#1E293B',
        minHeight: 56,
    },
    button: {
        backgroundColor: '#0F172A',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
