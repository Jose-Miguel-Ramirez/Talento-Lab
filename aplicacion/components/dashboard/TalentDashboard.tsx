import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

import { useTalentDashboard } from './hooks/useTalentDashboard';
import { DashboardHeader } from './ui/DashboardHeader';
import { StatCard } from './ui/StatCard';
import { ActionGrid, ActionItem } from './ui/ActionGrid';

interface TalentDashboardProps {
    profile: any;
}

const QUICK_ACTIONS: ActionItem[] = [
    { id: 'feed', label: 'Publicaciones', icon: 'list.bullet', colors: ['#DB2777', '#F472B6'], route: '/(tabs)/feed' },
    { id: 'chat', label: 'Mensajes', icon: 'message.fill', colors: ['#8B5CF6', '#A78BFA'], route: '/chat' },
    { id: 'requests', label: 'Pedidos', icon: 'bell.badge.fill', colors: ['#EA580C', '#FB923C'], route: '/(tabs)/explore' },
    { id: 'calendar', label: 'Agenda', icon: 'calendar.badge.plus', colors: ['#4F46E5', '#818CF8'], route: '/(tabs)/explore' },
];

export default function TalentDashboard({ profile }: TalentDashboardProps) {
    const {
        isLocationActive,
        loadingLocation,
        toggleLocation,
        handleProfile,
        handleLogout
    } = useTalentDashboard(profile);

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
                subtitle="¡Listo para trabajar hoy!"
            />

            {/* Availability Switch */}
            <View style={[styles.statusCard, isLocationActive ? styles.statusActive : styles.statusInactive]}>
                <View style={styles.statusInfo}>
                    <View style={[styles.statusDot, { backgroundColor: isLocationActive ? '#10B981' : '#9CA3AF' }]} />
                    <View>
                        <ThemedText style={styles.statusTitle}>
                            {isLocationActive ? 'Disponible' : 'No disponible'}
                        </ThemedText>
                        <ThemedText style={styles.statusSubtitle}>
                            {isLocationActive ? 'Visible para clientes cercanos' : 'No apareces en el mapa'}
                        </ThemedText>
                    </View>
                </View>
                <Switch
                    trackColor={{ false: '#D1D5DB', true: '#A7F3D0' }}
                    thumbColor={isLocationActive ? '#10B981' : '#f4f3f4'}
                    ios_backgroundColor="#D1D5DB"
                    onValueChange={toggleLocation}
                    value={isLocationActive}
                    disabled={loadingLocation}
                />
            </View>

            {/* Stats Overview */}
            <View style={styles.statsRow}>
                <View style={{ flex: 1 }}>
                    <StatCard
                        label="Ganancias"
                        value="$1,250"
                        trend="+12%"
                        colors={['#ffffff', '#F8FAFC']}
                    />
                </View>
                <View style={{ width: 16 }} />
                <View style={{ flex: 1 }}>
                    <StatCard
                        label="Rating"
                        value="4.9"
                        icon="star.fill"
                        colors={['#ffffff', '#FFFBEB']}
                    />
                </View>
            </View>

            {/* Quick Actions */}
            <ThemedText style={styles.sectionTitle}>Acciones Rápidas</ThemedText>
            <ActionGrid actions={QUICK_ACTIONS} />

            {/* Recent Activity Placeholder */}
            <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>Actividad Reciente</ThemedText>
            </View>
            <View style={styles.emptyStateCard}>
                <IconSymbol name="list.clipboard" size={48} color="#CBD5E1" style={{ marginBottom: 16 }} />
                <ThemedText style={styles.emptyStateTitle}>Sin actividad reciente</ThemedText>
                <ThemedText style={styles.emptyStateText}>
                    Tus trabajos completados aparecerán aquí.
                </ThemedText>
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
    statusCard: {
        marginHorizontal: 24,
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    statusActive: {
        borderColor: '#A7F3D0',
        backgroundColor: '#ECFDF5',
    },
    statusInactive: {
        borderColor: '#E5E7EB',
    },
    statusInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    statusTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    statusSubtitle: {
        fontSize: 12,
        color: '#64748B',
    },
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 16,
        paddingHorizontal: 24,
        letterSpacing: -0.5,
    },
    sectionHeader: {
        marginBottom: 16,
    },
    emptyStateCard: {
        marginHorizontal: 24,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        borderStyle: 'dashed',
    },
    emptyStateTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 4,
    },
    emptyStateText: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
    },
});
