import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Profile } from '@/types/auth';

import { useClientDashboard } from './hooks/useClientDashboard';
import { DashboardHeader } from './ui/DashboardHeader';
import { ActionGrid, ActionItem } from './ui/ActionGrid';
import { NearbyTalentsList } from './ui/NearbyTalentsList';

interface ClientDashboardProps {
    profile: Profile;
}

const CATEGORIES: ActionItem[] = [
    { id: 'feed', label: 'Muro', icon: 'list.bullet', colors: ['#DB2777', '#F472B6'], route: '/(tabs)/feed' },
    { id: 'chat', label: 'Chat', icon: 'message.fill', colors: ['#8B5CF6', '#A78BFA'], route: '/chat' },
    { id: 'home', label: 'Hogar', icon: 'house.fill', colors: ['#4F46E5', '#818CF8'] },
    { id: 'tech', label: 'Tecnología', icon: 'desktopcomputer', colors: ['#0891B2', '#22D3EE'] },
    { id: 'auto', label: 'Auto', icon: 'car.fill', colors: ['#EA580C', '#FB923C'] },
    { id: 'events', label: 'Eventos', icon: 'party.popper.fill', colors: ['#BE185D', '#EC4899'] },
    { id: 'health', label: 'Salud', icon: 'heart.fill', colors: ['#DC2626', '#F87171'] },
    { id: 'garden', label: 'Jardín', icon: 'leaf.fill', colors: ['#16A34A', '#4ADE80'] },
];

export default function ClientDashboard({ profile }: ClientDashboardProps) {
    const {
        nearbyTalents,
        loadingTalents,
        handleProfile,
        handleLogout,
        handleSearch,
        handleStartChat
    } = useClientDashboard(profile);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <DashboardHeader
                profile={profile}
                onLogout={handleLogout}
                onProfile={handleProfile}
            />

            {/* Search Bar */}
            <TouchableOpacity style={styles.searchContainer} onPress={handleSearch} activeOpacity={0.9}>
                <LinearGradient
                    colors={[Colors.brand.darkBlue, '#1e293b']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.searchGradient}
                >
                    <View style={styles.searchContent}>
                        <IconSymbol name="magnifyingglass" size={24} color="#94a3b8" />
                        <View style={styles.searchTextDetails}>
                            <ThemedText style={styles.searchTitle}>Buscar Servicios</ThemedText>
                            <ThemedText style={styles.searchSubtitle}>¿Qué necesitas reparar hoy?</ThemedText>
                        </View>
                        <View style={styles.searchButton}>
                            <IconSymbol name="arrow.right" size={20} color="#fff" />
                        </View>
                    </View>
                </LinearGradient>
            </TouchableOpacity>

            {/* Categories */}
            <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>Categorías</ThemedText>
                <TouchableOpacity onPress={handleSearch}>
                    <ThemedText style={styles.seeAllText}>Ver todas</ThemedText>
                </TouchableOpacity>
            </View>

            <ActionGrid actions={CATEGORIES} />

            {/* Featured Talents */}
            <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>Talentos cerca de ti (15km)</ThemedText>
                <TouchableOpacity onPress={handleSearch}>
                    <ThemedText style={styles.seeAllText}>Ver mapa</ThemedText>
                </TouchableOpacity>
            </View>

            <NearbyTalentsList
                talents={nearbyTalents}
                loading={loadingTalents}
                onChatPress={handleStartChat}
            />

            {/* Promo Banner */}
            <View style={styles.promoBanner}>
                <LinearGradient
                    colors={[Colors.brand.orange, '#f97316']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.promoGradient}
                >
                    <View style={styles.promoContent}>
                        <ThemedText style={styles.promoTitle}>¿Necesitas ayuda urgente?</ThemedText>
                        <ThemedText style={styles.promoText}>Encuentra un profesional en minutos.</ThemedText>
                        <TouchableOpacity style={styles.promoButton} onPress={handleSearch}>
                            <ThemedText style={styles.promoButtonText}>Solicitar Ahora</ThemedText>
                        </TouchableOpacity>
                    </View>
                    <IconSymbol name="bolt.fill" size={60} color="rgba(255,255,255,0.2)" style={styles.promoIcon} />
                </LinearGradient>
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    contentContainer: {
        paddingTop: 60,
        paddingBottom: 40,
    },
    searchContainer: {
        marginHorizontal: 24,
        marginBottom: 32,
        shadowColor: Colors.brand.darkBlue,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
    },
    searchGradient: {
        borderRadius: 24,
        padding: 4,
    },
    searchContent: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    searchTextDetails: {
        flex: 1,
        marginLeft: 16,
    },
    searchTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    searchSubtitle: {
        color: '#94a3b8',
        fontSize: 13,
    },
    searchButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
        letterSpacing: -0.5,
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.brand.darkBlue,
    },
    promoBanner: {
        marginHorizontal: 24,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: Colors.brand.orange,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 8,
        marginTop: 8,
    },
    promoGradient: {
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    promoContent: {
        flex: 1,
        zIndex: 1,
    },
    promoTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 4,
    },
    promoText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 16,
        fontWeight: '500',
    },
    promoButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        alignSelf: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    promoButtonText: {
        color: Colors.brand.orange,
        fontWeight: '700',
        fontSize: 13,
    },
    promoIcon: {
        position: 'absolute',
        right: -10,
        bottom: -10,
        transform: [{ rotate: '-15deg' }],
    },
});
