import { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import { useLocalSearchParams } from 'expo-router';

// Placeholder for TalentCard component (to be extracted later)
const TalentCard = ({ talent }: { talent: any }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.avatarContainer}>
        {talent.avatar_url ? (
          <Image source={{ uri: talent.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: '#E0E7FF', justifyContent: 'center', alignItems: 'center' }]}>
            <ThemedText style={{ fontSize: 20, color: Colors.brand.darkBlue }}>
              {talent.first_name?.[0]}{talent.last_name?.[0]}
            </ThemedText>
          </View>
        )}
      </View>
      <View style={styles.cardInfo}>
        <ThemedText style={styles.name}>{talent.first_name} {talent.last_name}</ThemedText>
        <ThemedText style={styles.profession}>{talent.talent_profiles?.[0]?.profession || 'Profesional'}</ThemedText>
        <View style={styles.ratingContainer}>
          <IconSymbol name="star.fill" size={14} color="#F59E0B" />
          <ThemedText style={styles.rating}>4.8 (12)</ThemedText>
        </View>
      </View>
    </View>
    <ThemedText style={styles.bio} numberOfLines={2}>
      {talent.talent_profiles?.[0]?.bio || 'Sin biografía disponible.'}
    </ThemedText>
    <TouchableOpacity style={styles.contactButton}>
      <ThemedText style={styles.contactButtonText}>Contactar</ThemedText>
    </TouchableOpacity>
  </View>
);

export default function ExploreScreen() {
  const params = useLocalSearchParams();
  const initialQuery = typeof params.q === 'string' ? params.q : '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [talents, setTalents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Categories
  const categories = ['Todos', 'Electricista', 'Plomero', 'Carpintero', 'Jardinero', 'Pintor', 'Mecánico'];

  useEffect(() => {
    fetchTalents();
  }, [selectedCategory]); // Re-fetch when category changes

  // Also fetch if search query is submitted (not on every keystroke to avoid spam, or debounce)
  // For now, let's just fetch on mount and when filters change

  const fetchTalents = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select(`
                    *,
                    talent_profiles!inner(*)
                `)
        .eq('user_type', 'talent');

      if (selectedCategory && selectedCategory !== 'Todos') {
        // ILIKE for partial match on profession or use separate Category table in future
        // For now, let's assume profession field stores this
        query = query.ilike('talent_profiles.profession', `%${selectedCategory}%`);
      }

      if (searchQuery) {
        // Simple search on name or profession
        // Note: Supabase complex OR filters across joined tables can be tricky. 
        // Let's filter by name OR profession.
        // Since profession is in joined table, it's harder to do "OR" with parent table cols easily in one go without raw SQL or specific syntax.
        // Let's stick to simple filters for MVP.
      }

      const { data, error } = await query;

      if (error) throw error;
      setTalents(data || []);
    } catch (error) {
      console.error('Error fetching talents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = () => {
    fetchTalents();
  };

  return (
    <View style={styles.container}>
      {/* Header / Search Area */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Explorar Talentos</ThemedText>
        <View style={styles.searchBar}>
          <IconSymbol name="magnifyingglass" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="¿Qué servicio buscas?"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {categories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryChip,
                (selectedCategory === cat || (cat === 'Todos' && !selectedCategory)) && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(cat === 'Todos' ? null : cat)}
            >
              <ThemedText style={[
                styles.categoryText,
                (selectedCategory === cat || (cat === 'Todos' && !selectedCategory)) && styles.categoryTextActive
              ]}>
                {cat}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.brand.darkBlue} />
        </View>
      ) : (
        <FlatList
          data={talents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TalentCard talent={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.center}>
              <ThemedText style={{ color: '#999' }}>No se encontraron talentos.</ThemedText>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.brand.darkBlue,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.brand.darkBlue,
  },
  categoriesContainer: {
    flexDirection: 'row',
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: Colors.brand.darkBlue,
  },
  categoryText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 24,
    gap: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  // Card Styles
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.brand.darkBlue,
  },
  profession: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  bio: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  contactButton: {
    backgroundColor: '#F0F9FF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#0284C7',
    fontWeight: '700',
    fontSize: 14,
  },
});
