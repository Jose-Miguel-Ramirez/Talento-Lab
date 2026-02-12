import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
    return (
        <View style={styles.container}>
            {Array.from({ length: totalSteps }).map((_, index) => {
                const step = index + 1;
                const isActive = step === currentStep;
                const isCompleted = step < currentStep;

                return (
                    <View key={step} style={styles.stepWrapper}>
                        {/* Line connector */}
                        {index > 0 && (
                            <View
                                style={[
                                    styles.connector,
                                    (isCompleted || isActive) ? styles.connectorActive : null
                                ]}
                            />
                        )}

                        {/* Circle */}
                        <Animated.View
                            entering={FadeIn.delay(index * 100)}
                            style={[
                                styles.circle,
                                isActive && styles.circleActive,
                                isCompleted && styles.circleCompleted
                            ]}
                        >
                            {isCompleted ? (
                                <IconSymbol name="checkmark" size={14} color="#fff" />
                            ) : (
                                <ThemedText style={[styles.number, isActive && styles.numberActive]}>
                                    {step}
                                </ThemedText>
                            )}
                        </Animated.View>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },
    stepWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    connector: {
        width: 30,
        height: 2,
        backgroundColor: '#E2E8F0',
        marginHorizontal: 4,
    },
    connectorActive: {
        backgroundColor: Colors.brand.darkBlue,
    },
    circle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#CBD5E1',
    },
    circleActive: {
        borderColor: Colors.brand.darkBlue,
        backgroundColor: '#fff',
    },
    circleCompleted: {
        backgroundColor: Colors.brand.darkBlue,
        borderColor: Colors.brand.darkBlue,
    },
    number: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748B',
    },
    numberActive: {
        color: Colors.brand.darkBlue,
    },
});
