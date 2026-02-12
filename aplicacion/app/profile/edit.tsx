import { View, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image as RNImage } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BackButton } from '@/components/ui/BackButton';
import { supabase, uploadFile } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

export default function EditProfileScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        email: '', // Read only
        avatar_url: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setFormData({
                        first_name: data.first_name || '',
                        last_name: data.last_name || '',
                        phone: data.phone || '',
                        email: data.email || user.email || '',
                        avatar_url: data.avatar_url || '',
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No authenticated user');

            let avatarUrl = formData.avatar_url;

            if (image) {
                const ext = image.substring(image.lastIndexOf('.') + 1);
                const fileName = `${user.id}/avatar.${ext}`;
                // Upload to 'avatars' bucket
                avatarUrl = await uploadFile(image, 'avatars', fileName);
            }

            const { error } = await supabase
                .from('profiles')
                .update({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone: formData.phone,
                    avatar_url: avatarUrl,
                })
                .eq('id', user.id);

            if (error) throw error;

            Alert.alert('Éxito', 'Perfil actualizado correctamente');
            router.back();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudo actualizar el perfil');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <BackButton />
                <ThemedText style={styles.headerTitle}>Mis Datos</ThemedText>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                        {image || formData.avatar_url ? (
                            <Image
                                source={{ uri: image || formData.avatar_url }}
                                style={styles.avatar}
                                contentFit="cover"
                                transition={1000}
                            />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <ThemedText style={styles.avatarText}>
                                    {formData.first_name ? formData.first_name[0].toUpperCase() : 'U'}
                                </ThemedText>
                            </View>
                        )}
                        <View style={styles.editIconBadge}>
                            <IconSymbol name="pencil" size={12} color="#fff" />
                        </View>
                    </TouchableOpacity>
                    <ThemedText style={styles.changePhotoText}>Toca para cambiar foto</ThemedText>
                </View>

                <View style={styles.formGroup}>
                    <ThemedText style={styles.label}>Nombre</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={formData.first_name}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, first_name: text }))}
                        placeholder="Tu nombre"
                    />
                </View>

                <View style={styles.formGroup}>
                    <ThemedText style={styles.label}>Apellido</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={formData.last_name}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, last_name: text }))}
                        placeholder="Tu apellido"
                    />
                </View>

                <View style={styles.formGroup}>
                    <ThemedText style={styles.label}>Teléfono</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={formData.phone}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                        placeholder="+52..."
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.formGroup}>
                    <ThemedText style={styles.label}>Correo Electrónico</ThemedText>
                    <TextInput
                        style={[styles.input, styles.disabledInput]}
                        value={formData.email}
                        editable={false}
                    />
                    <ThemedText style={styles.helperText}>El correo no se puede cambiar.</ThemedText>
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, loading && styles.disabledButton]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <ThemedText style={styles.saveButtonText}>Guardar Cambios</ThemedText>
                    )}
                </TouchableOpacity>
            </View>
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
    avatarSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 8,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.brand.darkBlue,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 36,
        color: '#fff',
        fontWeight: 'bold',
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.brand.orange,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    changePhotoText: {
        fontSize: 14,
        color: Colors.brand.darkBlue,
        fontWeight: '600',
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#111827',
    },
    disabledInput: {
        color: '#9CA3AF',
        backgroundColor: '#F3F4F6',
    },
    helperText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    saveButton: {
        backgroundColor: Colors.brand.darkBlue,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 12,
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
