import React from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { PROBLEMS, SOLUTIONS } from '@/constants/landing-data';

export function ProblemSolutionSection() {
    const { width } = useWindowDimensions();
    const isSmallScreen = width < 768;

    return (
        <>
            {/* Problem Section */}
            <View style={styles.sectionContainer}>
                <View style={[styles.badge, styles.problemBadge]}>
                    <IconSymbol name="exclamationmark.triangle.fill" size={12} color="#EF4444" />
                    <ThemedText style={[styles.badgeText, { color: '#EF4444' }]}>El Problema</ThemedText>
                </View>

                <ThemedText style={styles.sectionTitle}>
                    Por qué contratar servicios es complicado hoy
                </ThemedText>

                <View style={[styles.grid, isSmallScreen ? styles.gridColumn : styles.gridRow]}>
                    {PROBLEMS.map((problem, index) => (
                        <Animated.View
                            key={problem.id}
                            entering={FadeInDown.delay(index * 100).springify()}
                            style={[styles.card, styles.problemCard]}
                        >
                            <View style={styles.problemIcon}>
                                <IconSymbol name={problem.icon} size={24} color="#EF4444" />
                            </View>
                            <ThemedText style={styles.cardTitle}>{problem.title}</ThemedText>
                            <ThemedText style={styles.cardDescription}>{problem.description}</ThemedText>
                        </Animated.View>
                    ))}
                </View>
            </View>

            {/* Solution Section */}
            <View style={styles.sectionContainer}>
                <View style={[styles.badge, styles.solutionBadge]}>
                    <IconSymbol name="checkmark.circle.fill" size={12} color="#10B981" />
                    <ThemedText style={[styles.badgeText, { color: '#059669' }]}>La Solución</ThemedText>
                </View>

                <ThemedText style={styles.sectionTitle}>
                    Cómo TalentoLab transforma el mercado
                </ThemedText>

                <ThemedText style={styles.sectionSubtitle}>
                    No somos una app de servicios tradicional ni una bolsa de empleo. Somos infraestructura
                    para que el talento salga al mercado con respaldo.
                </ThemedText>

                <View style={[styles.grid, isSmallScreen ? styles.gridColumn : styles.gridRow]}>
                    {SOLUTIONS.map((solution, index) => (
                        <Animated.View
                            key={solution.id}
                            entering={FadeInDown.delay(index * 100 + 200).springify()}
                            style={styles.solutionCardWrapper}
                        >
                            <View style={[styles.card, styles.solutionCard]}>
                                <LinearGradient
                                    colors={solution.gradient}
                                    style={styles.solutionIconContainer}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <IconSymbol name={solution.icon} size={32} color="#fff" />
                                </LinearGradient>
                                <ThemedText style={styles.cardTitle}>{solution.title}</ThemedText>
                                <ThemedText style={styles.cardDescription}>{solution.description}</ThemedText>
                            </View>
                        </Animated.View>
                    ))}
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        paddingVertical: 80,
        paddingHorizontal: 24,
        alignItems: 'center',
        maxWidth: 1200,
        alignSelf: 'center',
        width: '100%',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 24,
        borderWidth: 1,
    },
    problemBadge: {
        backgroundColor: '#FEF2F2', // Red-50
        borderColor: '#FEE2E2', // Red-100
    },
    solutionBadge: {
        backgroundColor: '#ECFDF5', // Emerald-50
        borderColor: '#D1FAE5', // Emerald-100
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    sectionTitle: {
        fontSize: 36,
        fontWeight: '800',
        color: '#0F172A',
        textAlign: 'center',
        marginBottom: 16,
        letterSpacing: -1,
    },
    sectionSubtitle: {
        fontSize: 18,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 60,
        maxWidth: 700,
        lineHeight: 28,
    },
    grid: {
        width: '100%',
        gap: 24,
    },
    gridRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    gridColumn: {
        flexDirection: 'column',
    },
    card: {
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
    },
    problemCard: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        flex: 1,
        minWidth: 280,
    },
    solutionCardWrapper: {
        flex: 1,
        minWidth: 280,
    },
    solutionCard: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        height: '100%',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    problemIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#FEF2F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    solutionIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 12,
        textAlign: 'center',
    },
    cardDescription: {
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 24,
    },
});
