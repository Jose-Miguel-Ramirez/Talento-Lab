import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';

interface TalentMapProps {
    talents?: any[];
}

export default function TalentMap({ talents = [] }: TalentMapProps) {
    return (
        <View style={styles.container}>
            <ThemedText style={styles.text}>Mapa optimizado para Móvil (Android/iOS)</ThemedText>
            <ThemedText style={styles.subtext}>La visualización web está en desarrollo.</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 24,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    subtext: {
        fontSize: 14,
        color: '#666',
    },
});
