import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { LANDING_STATS } from '@/constants/landing-data';
import { Colors } from '@/constants/theme';

export function TrustSection() {
    const { width } = useWindowDimensions();
    const isSmallScreen = width < 768;

    return (
        <View style={styles.container}>
            <View style={styles.skewedBackground} />

            <View style={styles.content}>
                <View style={styles.textColumn}>
                    <ThemedText style={[styles.title, isSmallScreen && { fontSize: 32, lineHeight: 38 }]}>
                        Elimina la dependencia de "conocer a alguien"
                    </ThemedText>
                    <ThemedText style={styles.description}>
                        TalentoLab reemplaza las recomendaciones informales con ofertas visibles,
                        historial verificado y reputación real.
                    </ThemedText>
                </View>

                <View style={[styles.statsGrid, isSmallScreen && styles.statsGridVertical]}>
                    {LANDING_STATS.map((stat, index) => (
                        <Animated.View
                            key={index}
                            entering={FadeInUp.delay(index * 150)}
                            style={styles.statItem}
                        >
                            <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
                            <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
                        </Animated.View>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        paddingVertical: 100,
        overflow: 'hidden',
        // Ensure enough space for the skew effect not to cut content
        paddingTop: 120,
    },
    skewedBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: Colors.brand.darkBlue,
        transform: [{ skewY: '-3deg' }],
        zIndex: -1,
        // Extend height to cover skew gaps
        marginTop: -50,
        marginBottom: -50,
    },
    content: {
        maxWidth: 1200,
        width: '100%',
        alignSelf: 'center',
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    textColumn: {
        marginBottom: 60,
        maxWidth: 800,
        alignItems: 'center',
    },
    title: {
        fontSize: 32, // Reduced from 40 for better mobile fit, or use responsive logic in style prop
        fontWeight: '900',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 24,
        letterSpacing: -1,
        lineHeight: 40,
    },
    description: {
        fontSize: 16, // Slightly reduced
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        lineHeight: 26,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        maxWidth: 900,
        gap: 40,
    },
    statsGridVertical: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 48, // Increased gap for vertical stack
    },
    statItem: {
        alignItems: 'center',
        padding: 10,
    },
    statValue: {
        fontSize: 42, // Reduced from 56
        fontWeight: '900',
        color: Colors.brand.orange,
        marginBottom: 8,
        letterSpacing: -1,
    },
    statLabel: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.6)',
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontWeight: '700',
        textAlign: 'center',
    },
});
