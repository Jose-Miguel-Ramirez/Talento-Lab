import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Platform, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 768;

export function HeroSection() {
    const router = useRouter();

    return (
        <View style={styles.heroSection}>
            <LinearGradient
                colors={['#0F172A', '#1E3A8A', '#2563EB']}
                style={styles.heroGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Animated.View entering={FadeIn.delay(200)} style={styles.heroContent}>
                    <Animated.View entering={FadeInUp.delay(300)} style={styles.heroBadge}>
                        <ThemedText style={styles.heroBadgeText}>Servicios Presenciales · Talento Verificado</ThemedText>
                    </Animated.View>

                    <Animated.Text entering={FadeInUp.delay(400)} style={styles.heroTitle}>
                        Infraestructura de Talento y Confianza
                    </Animated.Text>

                    <Animated.Text entering={FadeInUp.delay(500)} style={styles.heroSubtitle}>
                        Oferta profesional de servicios presenciales sin depender de recomendaciones ni contactos.
                        Encuentra talento confiable o construye tu reputación como profesional.
                    </Animated.Text>

                    {Platform.OS === 'web' && (
                        <Animated.View entering={FadeInUp.delay(600)} style={styles.imageContainer}>
                            <Image
                                source={require('@/assets/images/hero.png')}
                                style={styles.heroImage}
                                resizeMode="contain"
                            />
                        </Animated.View>
                    )}

                    <Animated.View entering={FadeInUp.delay(700)} style={styles.heroButtons}>
                        <TouchableOpacity
                            style={styles.heroPrimaryButton}
                            onPress={() => router.push('/register' as any)}
                            accessibilityRole="button"
                            accessibilityLabel="Ofrece tus servicios profesionalmente"
                        >
                            <ThemedText style={styles.heroPrimaryButtonText}>Ofrece tus Servicios</ThemedText>
                            <IconSymbol name="arrow.right" size={20} color="#0F172A" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.heroSecondaryButton}
                            onPress={() => router.push('/register' as any)}
                            accessibilityRole="button"
                            accessibilityLabel="Encuentra talento verificado"
                        >
                            <ThemedText style={styles.heroSecondaryButtonText}>Encuentra Talento</ThemedText>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    heroSection: {
        marginBottom: 0,
    },
    heroGradient: {
        paddingHorizontal: 24,
        paddingVertical: 80,
        alignItems: 'center',
    },
    heroContent: {
        alignItems: 'center',
        maxWidth: 1000,
        width: '100%',
    },
    heroBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.25)',
    },
    heroBadgeText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    imageContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 40,
    },
    heroImage: {
        width: '100%',
        maxWidth: 800,
        height: 400,
        marginTop: 10,
    },
    heroTitle: {
        fontSize: isSmallScreen ? 36 : 56,
        fontWeight: '900',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 24,
        letterSpacing: -1.5,
        lineHeight: isSmallScreen ? 44 : 64,
        maxWidth: 900,
    },
    heroSubtitle: {
        fontSize: isSmallScreen ? 18 : 20,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginBottom: 48,
        lineHeight: 30,
        maxWidth: 700,
    },
    heroButtons: {
        flexDirection: isSmallScreen ? 'column' : 'row',
        gap: 16,
        width: '100%',
        maxWidth: 500,
    },
    heroPrimaryButton: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 32,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        flex: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    heroPrimaryButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
    },
    heroSecondaryButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 32,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    heroSecondaryButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});
