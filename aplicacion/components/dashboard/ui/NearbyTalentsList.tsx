import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';

interface Talent {
    id: string;
    first_name: string;
    last_name: string;
    profession?: string;
    image: string;
    rating?: number;
    distance?: number;
    jobs?: number;
}

interface NearbyTalentsListProps {
    talents: any[];
    loading: boolean;
    onChatPress: (id: string) => void;
}

export function NearbyTalentsList({ talents, loading, onChatPress }: NearbyTalentsListProps) {
    if (loading) {
        return (
            <View style={styles.listContent}>
                {[1, 2, 3].map((key) => (
                    <View key={key} style={[styles.card, styles.skeletonCard, { marginRight: 16 }]}>
                        <View style={styles.skeletonImage} />
                        <View style={styles.skeletonTextV} />
                        <View style={styles.skeletonTextH} />
                    </View>
                ))}
            </View>
        );
    }

    if (talents.length === 0) {
        return (
            <View style={styles.emptyState}>
                <ThemedText style={styles.emptyText}>
                    No se encontraron talentos cercanos. Intenta ampliar el rango.
                </ThemedText>
            </View>
        );
    }

    const renderItem = ({ item, index }: { item: Talent, index: number }) => (
        <Animated.View entering={FadeInRight.delay(400 + (index * 100)).springify()} style={styles.cardWrapper}>
            <TouchableOpacity style={styles.card} activeOpacity={0.8}>
                <Image source={{ uri: item.image }} style={styles.image} contentFit="cover" transition={500} />
                <View style={styles.info}>
                    <View style={styles.ratingBadge}>
                        <IconSymbol name="star.fill" size={10} color="#FBBF24" />
                        <ThemedText style={styles.ratingText}>{item.rating?.toFixed(1) || '5.0'}</ThemedText>
                    </View>
                    <ThemedText style={styles.name} numberOfLines={1}>{item.first_name} {item.last_name}</ThemedText>
                    <ThemedText style={styles.profession} numberOfLines={1}>{item.profession || 'Profesional'}</ThemedText>
                    <ThemedText style={styles.distance}>{item.distance ? `${item.distance.toFixed(1)} km` : 'Cerca'}</ThemedText>

                    <TouchableOpacity
                        style={styles.chatButton}
                        onPress={() => onChatPress(item.id)}
                    >
                        <IconSymbol name="message.fill" size={14} color="#fff" />
                        <ThemedText style={styles.chatButtonText}>Chat</ThemedText>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <FlatList
            data={talents}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
        />
    );
}

const styles = StyleSheet.create({
    listContent: {
        paddingHorizontal: 24,
        gap: 16,
        paddingBottom: 32,
        flexDirection: 'row',
    },
    cardWrapper: {
        marginRight: 4,
    },
    card: {
        width: 160,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    image: {
        width: '100%',
        height: 120,
        borderRadius: 16,
        marginBottom: 12,
        backgroundColor: '#E2E8F0',
    },
    info: {
        gap: 4,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        gap: 4,
    },
    ratingText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#B45309',
    },
    name: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
    },
    profession: {
        fontSize: 12,
        color: '#64748B',
    },
    distance: {
        fontSize: 11,
        color: Colors.brand.darkBlue,
        fontWeight: '600',
        marginBottom: 8,
    },
    chatButton: {
        backgroundColor: Colors.brand.darkBlue,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
    },
    chatButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    emptyState: {
        marginHorizontal: 24,
        padding: 24,
        backgroundColor: '#fff',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    emptyText: {
        color: '#64748B',
        textAlign: 'center',
    },
    // Skeleton Styles
    skeletonCard: {
        height: 260,
        justifyContent: 'flex-start',
    },
    skeletonImage: {
        width: '100%',
        height: 120,
        borderRadius: 16,
        backgroundColor: '#F1F5F9',
        marginBottom: 12,
    },
    skeletonTextV: {
        height: 16,
        backgroundColor: '#F1F5F9',
        borderRadius: 4,
        marginBottom: 8,
        width: '80%',
    },
    skeletonTextH: {
        height: 12,
        backgroundColor: '#F1F5F9',
        borderRadius: 4,
        marginBottom: 4,
        width: '60%',
    },
});
