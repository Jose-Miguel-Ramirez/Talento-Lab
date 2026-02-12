import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setProfile(data);
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro que deseas salir?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Salir",
                    style: "destructive",
                    onPress: async () => {
                        await supabase.auth.signOut();
                        router.replace('/(tabs)');
                    }
                }
            ]
        );
    };

    const MenuOption = ({ icon, label, onPress, isDestructive = false, showChevron = true }: any) => (
        <TouchableOpacity style={styles.menuOption} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.menuIconContainer}>
                <IconSymbol name={icon} size={22} color={isDestructive ? '#EF4444' : Colors.brand.darkBlue} />
            </View>
            <ThemedText style={[styles.menuText, isDestructive && styles.destructiveText]}>{label}</ThemedText>
            {showChevron && <IconSymbol name="chevron.right" size={20} color="#9CA3AF" />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color="#111827" />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>Mi Perfil</ThemedText>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* User Card */}
                <View style={styles.userCard}>
                    <View style={styles.avatar}>
                        <ThemedText style={styles.avatarText}>
                            {profile?.first_name ? profile.first_name[0].toUpperCase() : 'C'}
                        </ThemedText>
                    </View>
                    <View style={styles.userInfo}>
                        <ThemedText style={styles.userName}>
                            {profile?.first_name} {profile?.last_name}
                        </ThemedText>
                        <ThemedText style={styles.userEmail}>{profile?.email || 'Usuario'}</ThemedText>
                        <View style={styles.badge}>
                            <ThemedText style={styles.badgeText}>Cliente</ThemedText>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.editButton}>
                        <IconSymbol name="chevron.left.forwardslash.chevron.right" size={20} color={Colors.brand.darkBlue} />
                        {/* Using a generic icon for edit as placeholder if specific pencil isn't mapped, 
                             or better, use chevron.right to imply navigation to edit */}
                    </TouchableOpacity>
                </View>

                {/* Menu Sections */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionHeader}>Mi Cuenta</ThemedText>
                    <MenuOption icon="person.fill" label="Mis Datos Personales" onPress={() => router.push('/profile/edit' as any)} />
                    <MenuOption icon="house.fill" label="Mis Direcciones" onPress={() => router.push('/profile/addresses' as any)} />
                    <MenuOption icon="heart.fill" label="Favoritos" onPress={() => router.push('/profile/favorites' as any)} />
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.sectionHeader}>Ajustes</ThemedText>
                    <MenuOption icon="bell.fill" label="Notificaciones" onPress={() => router.push('/profile/notifications' as any)} />
                    <MenuOption icon="lock.fill" label="Privacidad y Seguridad" onPress={() => router.push('/profile/privacy' as any)} />
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.sectionHeader}>Ayuda</ThemedText>
                    <MenuOption icon="questionmark.circle.fill" label="Centro de Ayuda" onPress={() => router.push('/profile/help' as any)} />
                    <MenuOption icon="doc.text.fill" label="Términos y Condiciones" onPress={() => { }} />
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <ThemedText style={styles.logoutText}>Cerrar Sesión</ThemedText>
                </TouchableOpacity>

                <ThemedText style={styles.versionText}>Versión 1.0.0</ThemedText>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    content: {
        padding: 16,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.brand.darkBlue,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    badge: {
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.brand.darkBlue,
    },
    editButton: {
        padding: 8,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 8,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        marginLeft: 12,
        marginTop: 12,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    menuOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: '#374151',
        fontWeight: '500',
    },
    destructiveText: {
        color: '#EF4444',
    },
    logoutButton: {
        backgroundColor: '#FEF2F2',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    logoutText: {
        color: '#EF4444',
        fontWeight: '700',
        fontSize: 16,
    },
    versionText: {
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: 12,
        marginBottom: 32,
    },
});
