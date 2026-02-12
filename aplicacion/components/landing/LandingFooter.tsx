import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/themed-text';

export function LandingFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <View style={styles.footer}>
            <View style={styles.content}>
                <View style={styles.brandSection}>
                    <Image
                        source={require('@/assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <ThemedText style={styles.tagline}>Infraestructura de talento y confianza</ThemedText>
                </View>

                <View style={styles.linksSection}>
                    <Link href="/about" asChild>
                        <TouchableOpacity>
                            <ThemedText style={styles.link}>Acerca de</ThemedText>
                        </TouchableOpacity>
                    </Link>
                    <Link href="/contact" asChild>
                        <TouchableOpacity>
                            <ThemedText style={styles.link}>Contacto</ThemedText>
                        </TouchableOpacity>
                    </Link>
                    <Link href="/privacy" asChild>
                        <TouchableOpacity>
                            <ThemedText style={styles.link}>Privacidad</ThemedText>
                        </TouchableOpacity>
                    </Link>
                    <Link href="/terms" asChild>
                        <TouchableOpacity>
                            <ThemedText style={styles.link}>Términos</ThemedText>
                        </TouchableOpacity>
                    </Link>
                </View>

                <ThemedText style={styles.copyright}>
                    © {currentYear} TalentoLab. Todos los derechos reservados.
                </ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.05)',
        paddingVertical: 40,
    },
    content: {
        maxWidth: 1200,
        width: '100%',
        alignSelf: 'center',
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    brandSection: {
        alignItems: 'center',
        marginBottom: 32,
        gap: 12,
    },
    logo: {
        height: 32,
        width: 140,
        opacity: 0.9,
    },
    tagline: {
        fontSize: 14,
        color: '#64748B',
        fontStyle: 'italic',
    },
    linksSection: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 32,
        marginBottom: 32,
    },
    link: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '600',
    },
    copyright: {
        fontSize: 13,
        color: '#94A3B8',
        textAlign: 'center',
    },
});
