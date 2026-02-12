import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';

export function CallToActionSection() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.brand.orange, '#FBBF24']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.content}>
                    <ThemedText style={styles.title}>
                        ¿Listo para construir tu reputación?
                    </ThemedText>
                    <ThemedText style={styles.subtitle}>
                        Únete a la primera plataforma diseñada para que el talento en servicios presenciales
                        pueda salir al mercado de forma profesional.
                    </ThemedText>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push('/register' as any)}
                        activeOpacity={0.9}
                    >
                        <ThemedText style={styles.buttonText}>Comenzar Ahora</ThemedText>
                        <IconSymbol name="arrow.right" size={20} color={Colors.brand.orange} />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingBottom: 80,
        paddingTop: 80,
        maxWidth: 1200,
        alignSelf: 'center',
        width: '100%',
    },
    gradient: {
        borderRadius: 40,
        paddingVertical: 64,
        paddingHorizontal: 32,
        alignItems: 'center',
        shadowColor: Colors.brand.orange,
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.3,
        shadowRadius: 40,
        elevation: 20,
    },
    content: {
        maxWidth: 700,
        alignItems: 'center',
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 16,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.95)',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 28,
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 40,
        paddingVertical: 20,
        borderRadius: 20,
        alignItems: 'center',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '800',
        color: Colors.brand.orange,
    },
});
