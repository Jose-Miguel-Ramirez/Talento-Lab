import { View, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BackButton } from '@/components/ui/BackButton';
import { ThemedText } from '@/components/themed-text';
import TalentMap from '@/components/map/TalentMap';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import * as Location from 'expo-location';

export default function ExploreScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [talents, setTalents] = useState<any[]>([]);

    useEffect(() => {
        fetchNearbyTalents();
    }, []);

    const fetchNearbyTalents = async () => {
        try {
            // Get user location for the query
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.warn('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            // Call the Supabase RPC function
            const { data, error } = await supabase
                .rpc('get_nearby_talents', {
                    lat: latitude,
                    long: longitude,
                    radius_km: 10 // 10km radius
                });

            if (error) {
                console.error('RPC Error:', error);
                throw error;
            }

            setTalents(data || []);
        } catch (e) {
            console.error('Error fetching nearby talents:', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <TalentMap talents={talents} />

            {/* Overlay Header */}
            <SafeAreaView style={styles.overlayHeader} edges={['top']}>
                <View style={styles.searchBar}>
                    <BackButton style={styles.backButton} color="#000" />
                    <View style={styles.inputContainer}>
                        <IconSymbol name="magnifyingglass" size={20} color="#666" />
                        <TextInput
                            placeholder="Buscar servicios cercanos..."
                            style={styles.input}
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>
            </SafeAreaView>

            {/* Location Info / Filter Chip */}
            <View style={styles.filterChip}>
                <IconSymbol name="mappin.and.ellipse" size={16} color="#fff" />
                <ThemedText style={styles.filterText}>Radio: 5km</ThemedText>
            </View>

            {loading && (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={Colors.brand.darkBlue} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlayHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: 44,
        borderRadius: 22,
        paddingHorizontal: 16,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    filterChip: {
        position: 'absolute',
        top: 120,
        right: 16,
        backgroundColor: Colors.brand.darkBlue,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    filterText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    loader: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.5)',
    }
});
