import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { getOrCreateConversation } from '@/lib/chatHelpers';
import { Profile } from '@/types/auth';

export const useClientDashboard = (profile: Profile) => {
    const router = useRouter();
    const [nearbyTalents, setNearbyTalents] = useState<any[]>([]);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [loadingTalents, setLoadingTalents] = useState(true);

    const fetchNearbyTalents = useCallback(async (lat: number, long: number) => {
        setLoadingTalents(true);
        try {
            // Updated radius to 15km as requested
            const { data, error } = await supabase.rpc('get_nearby_talents', {
                lat,
                long,
                radius_km: 15
            });

            if (error) throw error;

            if (data) {
                const talentsWithDetails = await Promise.all(data.map(async (p: any) => {
                    const { data: talentDetails } = await supabase
                        .from('talent_profiles')
                        .select('profession, rating, experience_years')
                        .eq('id', p.id)
                        .single();

                    return {
                        ...p,
                        ...talentDetails,
                        image: p.avatar_url || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', // Fallback
                        jobs: (talentDetails?.experience_years || 0) * 12, // Mock jobs based on experience
                        rating: talentDetails?.rating || 5.0 // Mock or real rating
                    };
                }));

                setNearbyTalents(talentsWithDetails);
            }
        } catch (error) {
            console.error('Error fetching nearby talents:', error);
        } finally {
            setLoadingTalents(false);
        }
    }, []);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Permite el acceso a la ubicación para encontrar talentos cercanos.');
                setLoadingTalents(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            fetchNearbyTalents(location.coords.latitude, location.coords.longitude);
        })();
    }, [fetchNearbyTalents]);

    const handleProfile = () => {
        router.push('/profile' as any);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace('/(tabs)');
    };

    const handleSearch = () => {
        router.push('/explore' as any);
    };

    const handleStartChat = async (talentId: string) => {
        try {
            const conversationId = await getOrCreateConversation(profile.id, talentId);
            router.push(`/chat/${conversationId}` as any);
        } catch (error) {
            console.error('Error starting chat:', error);
            Alert.alert('Error', 'No se pudo iniciar el chat. Intenta de nuevo.');
        }
    };

    return {
        nearbyTalents,
        location,
        loadingTalents,
        fetchNearbyTalents,
        handleProfile,
        handleLogout,
        handleSearch,
        handleStartChat
    };
};
