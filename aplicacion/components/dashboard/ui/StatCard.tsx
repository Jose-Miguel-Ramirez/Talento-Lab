import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface StatCardProps {
    label: string;
    value: string;
    icon?: any;
    trend?: string;
    trendDirection?: 'up' | 'down';
    colors?: [string, string, ...string[]];
}

export function StatCard({ label, value, icon, trend, trendDirection = 'up', colors = ['#ffffff', '#F8FAFC'] }: StatCardProps) {
    return (
        <LinearGradient
            colors={colors}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
        >
            <View style={styles.content}>
                <View>
                    <ThemedText style={styles.label}>{label}</ThemedText>
                    <ThemedText style={styles.value}>{value}</ThemedText>
                    {trend && (
                        <View style={[styles.trendBadge, trendDirection === 'down' && styles.trendDown]}>
                            <IconSymbol
                                name={trendDirection === 'up' ? 'arrow.up.right' : 'arrow.up.right'}
                                size={12}
                                color={trendDirection === 'up' ? '#166534' : '#991B1B'}
                            />
                            <ThemedText style={[styles.trendText, trendDirection === 'down' && styles.trendTextDown]}>
                                {trend}
                            </ThemedText>
                        </View>
                    )}
                </View>
                {icon && (
                    <View style={styles.iconContainer}>
                        <IconSymbol name={icon} size={24} color="#FBBF24" />
                    </View>
                )}
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
        marginBottom: 16,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    label: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    value: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1E293B',
        letterSpacing: -1,
        marginBottom: 8,
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    trendDown: {
        backgroundColor: '#FEF2F2',
    },
    trendText: {
        fontSize: 12,
        color: '#166534',
        fontWeight: '700',
        marginLeft: 4,
    },
    trendTextDown: {
        color: '#991B1B',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFFBEB',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
