import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/auth';

export const useTalentDashboard = (profile: any) => {
    const router = useRouter();
    const [isLocationActive, setIsLocationActive] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);

    useEffect(() => {
        if (profile?.latitude && profile?.longitude) {
            setIsLocationActive(true);
        }
    }, [profile]);

    const handleProfile = () => {
        router.push('/profile' as any);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace('/(tabs)');
    };

    const toggleLocation = async (value: boolean) => {
        setLoadingLocation(true);
        try {
            if (value) {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permiso denegado', 'Necesitamos acceso a tu ubicación para que los clientes te encuentren.');
                    setLoadingLocation(false);
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = location.coords;

                const { error } = await supabase
                    .from('profiles')
                    .update({ latitude, longitude })
                    .eq('id', profile.id);

                if (error) throw error;
                setIsLocationActive(true);
                Alert.alert('Ubicación Activa', 'Ahora eres visible en el mapa para los clientes cercanos.');
            } else {
                const { error } = await supabase
                    .from('profiles')
                    .update({ latitude: null, longitude: null })
                    .eq('id', profile.id);

                if (error) throw error;
                setIsLocationActive(false);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo actualizar tu estado de ubicación.');
            // Revert switch state on error if needed, but for now we just keep it as is or could sync with prev state
        } finally {
            setLoadingLocation(false);
        }
    };

    return {
        isLocationActive,
        loadingLocation,
        toggleLocation,
        handleProfile,
        handleLogout
    };
};
