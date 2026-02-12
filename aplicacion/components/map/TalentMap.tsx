import { StyleSheet, View, Platform } from 'react-native';
import MapView, { Marker, UrlTile, PROVIDER_DEFAULT } from 'react-native-maps';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface TalentMapProps {
    talents?: any[]; // Replace with proper type later
}

export default function TalentMap({ talents = [] }: TalentMapProps) {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    const initialRegion = {
        latitude: location?.coords.latitude || 19.4326, // Default to Mexico City or reasonable default
        longitude: location?.coords.longitude || -99.1332,
        latitudeDelta: 0.05, // Roughly 5km zoom level
        longitudeDelta: 0.05,
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={PROVIDER_DEFAULT}
                mapType={Platform.OS === 'android' ? 'none' : 'standard'}
                initialRegion={initialRegion}
                region={location ? {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                } : undefined}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {/* OpenStreetMap Tiles */}
                <UrlTile
                    urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maximumZ={19}
                    zIndex={-1}
                />

                {/* Talent Markers */}
                {talents.map((talent) => (
                    <Marker
                        key={talent.id}
                        coordinate={{
                            latitude: talent.latitude,
                            longitude: talent.longitude,
                        }}
                        title={talent.first_name}
                        description={talent.service_type || 'Talento'}
                    >
                        <View style={styles.markerContainer}>
                            <IconSymbol name="mappin.and.ellipse" size={32} color={Colors.brand.darkBlue} />
                        </View>
                    </Marker>
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 24,
        overflow: 'hidden',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
