import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function LandingHeader() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'ios' ? 0 : 20) }]}>
            <View style={styles.headerContent}>
                <View style={styles.headerLeft}>
                    <Image
                        source={require('@/assets/images/logo.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                </View>
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => router.push('/login' as any)}
                    accessibilityRole="button"
                    accessibilityLabel="Acceder a la plataforma"
                >
                    <IconSymbol name="arrow.right.circle.fill" size={20} color="#fff" />
                    <ThemedText style={styles.loginButtonText}>Acceder</ThemedText>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.05)',
        zIndex: 10,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        maxWidth: 1200,
        alignSelf: 'center',
        width: '100%',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logoImage: {
        height: 40,
        width: 150,
    },
    loginButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: Colors.brand.darkBlue,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 30,
        shadowColor: Colors.brand.darkBlue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
});
