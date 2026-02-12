import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { Profile } from '@/types/auth';

interface DashboardHeaderProps {
    profile: Profile | any;
    onLogout: () => void;
    onProfile: () => void;
    title?: string;
    subtitle?: string;
}

export function DashboardHeader({ profile, onLogout, onProfile, title, subtitle }: DashboardHeaderProps) {
    const defaultTitle = `Hola, ${profile.first_name || 'Usuario'}`;
    const defaultSubtitle = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });

    return (
        <View style={styles.header}>
            <View>
                <ThemedText style={styles.subtitle}>{subtitle || defaultSubtitle}</ThemedText>
                <ThemedText style={styles.title}>{title || defaultTitle}</ThemedText>
            </View>
            <View style={styles.headerRight}>
                <TouchableOpacity onPress={onLogout} style={styles.iconButton}>
                    <IconSymbol name="rectangle.portrait.and.arrow.right" size={24} color={Colors.brand.darkBlue} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onProfile} style={styles.profileButton}>
                    {profile.avatar_url ? (
                        <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} contentFit="cover" />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <ThemedText style={styles.avatarText}>
                                {profile.first_name ? profile.first_name[0].toUpperCase() : 'U'}
                            </ThemedText>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    subtitle: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0F172A',
        letterSpacing: -0.5,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconButton: {
        padding: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    profileButton: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.brand.darkBlue,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    avatarImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: '#fff',
    },
    avatarText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
