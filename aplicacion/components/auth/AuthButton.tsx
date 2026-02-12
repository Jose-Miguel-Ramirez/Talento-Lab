import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';

interface AuthButtonProps {
    title: string;
    onPress: () => void;
    isLoading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline';
    disabled?: boolean;
}

export function AuthButton({
    title,
    onPress,
    isLoading = false,
    variant = 'primary',
    disabled = false
}: AuthButtonProps) {

    const getBackgroundColor = () => {
        if (disabled) return '#E2E8F0';
        switch (variant) {
            case 'primary': return Colors.brand.darkBlue;
            case 'secondary': return Colors.brand.orange;
            case 'outline': return 'transparent';
            default: return Colors.brand.darkBlue;
        }
    };

    const getTextColor = () => {
        if (disabled) return '#94A3B8';
        if (variant === 'outline') return Colors.brand.darkBlue;
        return '#fff';
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isLoading || disabled}
            style={[
                styles.button,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: variant === 'outline' ? Colors.brand.darkBlue : 'transparent',
                    borderWidth: variant === 'outline' ? 1 : 0,
                }
            ]}
            activeOpacity={0.8}
        >
            {isLoading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <ThemedText style={[styles.text, { color: getTextColor() }]}>
                    {title}
                </ThemedText>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 54,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    text: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});
