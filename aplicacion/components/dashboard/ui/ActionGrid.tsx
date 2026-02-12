import { View, StyleSheet, TouchableOpacity, Alert, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

export interface ActionItem {
    id: string;
    label: string;
    icon: string;
    colors: [string, string, ...string[]];
    route?: string;
}

interface ActionGridProps {
    actions: ActionItem[];
}

export function ActionGrid({ actions }: ActionGridProps) {
    const router = useRouter();
    const { width } = useWindowDimensions();

    const horizontalPadding = 48; // 24 * 2 from Dashboard container
    const gap = 12; // Reduced gap
    const availableWidth = width - horizontalPadding;
    const itemWidth = (availableWidth - gap) / 2;

    const handlePress = (action: ActionItem) => {
        if (action.route) {
            router.push(action.route as any);
        } else {
            Alert.alert('Próximamente', 'Esta función estará disponible pronto.');
        }
    };

    return (
        <View style={[styles.grid, { gap }]}>
            {actions.map((action, index) => (
                <Animated.View
                    key={action.id}
                    entering={FadeInDown.delay(300 + (index * 50)).springify()}
                    style={{ width: itemWidth }}
                >
                    <TouchableOpacity
                        style={styles.cardContainer}
                        activeOpacity={0.8}
                        onPress={() => handlePress(action)}
                    >
                        <LinearGradient
                            colors={action.colors}
                            style={styles.card}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <View style={styles.iconWrapper}>
                                <IconSymbol name={action.icon as any} size={24} color="#fff" />
                            </View>
                            <ThemedText style={styles.label}>{action.label}</ThemedText>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 32,
        paddingHorizontal: 24, // Move padding here if it was on parent, but context says parent handles it. 
        // We actually need to be careful. The parent ClientDashboard has contentContainerStyle padding.
        // Let's assume parent has padding and we just fill width.
        // Actually, looking at ClientDashboard styles: container has padding inside SearchContainer/etc but CATEGORIES are updated.
        // Looking at ClientDashboard.tsx line 74: <ActionGrid actions={CATEGORIES} />
        // ClientDashboard styles: contentContainer paddingBottom 40.
        // Wait, ClientDashboard uses `ActionGrid` directly in ScrollView.
        // Does ActionGrid need padding? The parent has full width ScrollView?
        // Let's check ClientDashboard again.
    },
    cardContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        borderRadius: 20,
    },
    card: {
        padding: 16, // Reduced padding
        borderRadius: 20,
        height: 110, // Reduced height
        justifyContent: 'space-between',
    },
    iconWrapper: {
        width: 44, // Reduced size
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 14, // Reduced font size
        fontWeight: '700',
        color: '#fff',
        letterSpacing: -0.2,
    },
});
