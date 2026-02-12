import { View, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BackButton } from '@/components/ui/BackButton';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddressesScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState('');

    useEffect(() => {
        fetchAddress();
    }, []);

    const fetchAddress = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('client_profiles')
                    .select('default_address')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setAddress(data.default_address || '');
                }
            }
        } catch (error) {
            console.error('Error fetching address:', error);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No authenticated user');

            // Check if client profile exists, if not insert, else update
            const { data: existingProfile } = await supabase
                .from('client_profiles')
                .select('id')
                .eq('id', user.id)
                .single();

            let error;
            if (existingProfile) {
                const res = await supabase
                    .from('client_profiles')
                    .update({ default_address: address })
                    .eq('id', user.id);
                error = res.error;
            } else {
                const res = await supabase
                    .from('client_profiles')
                    .insert({ id: user.id, default_address: address });
                error = res.error;
            }

            if (error) throw error;

            Alert.alert('Éxito', 'Dirección actualizada correctamente');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudo guardar la dirección');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <BackButton />
                <ThemedText style={styles.headerTitle}>Mis Direcciones</ThemedText>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.infoBox}>
                    <IconSymbol name="info.circle" size={24} color={Colors.brand.darkBlue} />
                    <ThemedText style={styles.infoText}>
                        Por ahora, solo soportamos una dirección principal para tus servicios.
                    </ThemedText>
                </View>

                <View style={styles.formGroup}>
                    <ThemedText style={styles.label}>Dirección Principal</ThemedText>
                    <View style={styles.inputContainer}>
                        <IconSymbol name="mappin.and.ellipse" size={20} color="#9CA3AF" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={address}
                            onChangeText={setAddress}
                            placeholder="Ej. Av. Reforma 123, Ciudad de México"
                            multiline
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, loading && styles.disabledButton]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <ThemedText style={styles.saveButtonText}>Guardar Dirección</ThemedText>
                    )}
                </TouchableOpacity>
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
        padding: 24,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#EEF2FF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        alignItems: 'center',
        gap: 12,
    },
    infoText: {
        flex: 1,
        color: Colors.brand.darkBlue,
        fontSize: 14,
        lineHeight: 20,
    },
    formGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start', // for multiline
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 12,
    },
    inputIcon: {
        marginTop: 4,
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#111827',
        minHeight: 40,
    },
    saveButton: {
        backgroundColor: Colors.brand.darkBlue,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: Colors.brand.darkBlue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    disabledButton: {
        opacity: 0.7,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
