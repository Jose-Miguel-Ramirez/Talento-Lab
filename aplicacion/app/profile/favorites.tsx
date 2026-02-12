import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BackButton } from '@/components/ui/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data for favorites
const MOCK_FAVORITES = [
    {
        id: '1',
        name: 'Roberto Gómez',
        profession: 'Electricista',
        rating: 4.9,
        image: null // Placeholder
    },
    {
        id: '2',
        name: 'Ana Martínez',
        profession: 'Carpintera',
        rating: 5.0,
        image: null
    }
];

export default function FavoritesScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <BackButton />
                <ThemedText style={styles.headerTitle}>Favoritos</ThemedText>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {MOCK_FAVORITES.length > 0 ? (
                    MOCK_FAVORITES.map((talent) => (
                        <TouchableOpacity key={talent.id} style={styles.card} activeOpacity={0.7}>
                            <View style={styles.cardImagePlaceholder}>
                                <ThemedText style={styles.avatarText}>{talent.name[0]}</ThemedText>
                            </View>
                            <View style={styles.cardInfo}>
                                <ThemedText style={styles.cardName}>{talent.name}</ThemedText>
                                <ThemedText style={styles.cardProfession}>{talent.profession}</ThemedText>
                                <View style={styles.ratingContainer}>
                                    <IconSymbol name="star.fill" size={14} color="#FBBF24" />
                                    <ThemedText style={styles.ratingText}>{talent.rating}</ThemedText>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.heartButton}>
                                <IconSymbol name="heart.fill" size={20} color="#EF4444" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <IconSymbol name="heart.slash" size={48} color="#D1D5DB" />
                        <ThemedText style={styles.emptyText}>Aún no tienes favoritos</ThemedText>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
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
        gap: 12,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    cardImagePlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.brand.darkBlue,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardInfo: {
        flex: 1,
    },
    cardName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    cardProfession: {
        fontSize: 14,
        color: '#6B7280',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
    },
    heartButton: {
        padding: 8,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
        gap: 16,
    },
    emptyText: {
        color: '#9CA3AF',
        fontSize: 16,
    }
});
