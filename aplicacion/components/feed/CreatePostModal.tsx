import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    Modal,
    ActivityIndicator,
    Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface CreatePostModalProps {
    visible: boolean;
    onClose: () => void;
    onPostCreated: () => void;
    userId: string;
    existingPost?: {
        id: string;
        content: string;
        image_url?: string | null;
    };
}

export function CreatePostModal({ visible, onClose, onPostCreated, userId, existingPost }: CreatePostModalProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [content, setContent] = useState(existingPost?.content || '');
    const [image, setImage] = useState<string | null>(existingPost?.image_url || null);
    const [loading, setLoading] = useState(false);

    // Reset state when modal opens/closes or existingPost changes
    React.useEffect(() => {
        if (visible) {
            setContent(existingPost?.content || '');
            setImage(existingPost?.image_url || null);
        }
    }, [visible, existingPost]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const uploadImage = async (uri: string) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();

            const fileExt = uri.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${userId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('posts')
                .upload(filePath, blob, {
                    contentType: blob.type || 'image/jpeg',
                });

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('posts').getPublicUrl(filePath);
            return data.publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    const handlePost = async () => {
        if (!content && !image) {
            Alert.alert('Error', 'Por favor agrega contenido o una imagen.');
            return;
        }

        setLoading(true);
        try {
            let imageUrl = image;
            // Only upload if it's a local URI (starts with file:// or content://)
            // If it's already an http URL, it's an existing image
            if (image && (image.startsWith('file:') || image.startsWith('content:'))) {
                imageUrl = await uploadImage(image);
            }

            if (existingPost) {
                // Update existing post
                const { error } = await supabase
                    .from('posts')
                    .update({
                        content,
                        image_url: imageUrl,
                    })
                    .eq('id', existingPost.id);

                if (error) throw error;
                Alert.alert('Éxito', 'Publicación actualizada correctamente.');
            } else {
                // Create new post
                const { error } = await supabase
                    .from('posts')
                    .insert({
                        talent_id: userId,
                        content,
                        image_url: imageUrl,
                    });

                if (error) throw error;
                Alert.alert('Éxito', 'Publicación creada correctamente.');
            }

            setContent('');
            setImage(null);
            onPostCreated();
            onClose();

        } catch (error) {
            Alert.alert('Error', existingPost ? 'No se pudo actualizar la publicación.' : 'No se pudo crear la publicación.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={[styles.cancelText, { color: theme.tint }]}>Cancelar</Text>
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: theme.text }]}>
                        {existingPost ? 'Editar Publicación' : 'Crear Publicación'}
                    </Text>
                    <TouchableOpacity onPress={handlePost} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color={theme.tint} />
                        ) : (
                            <Text style={[styles.postText, { color: theme.tint }]}>
                                {existingPost ? 'Guardar' : 'Publicar'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="¿En qué estás trabajando?"
                    placeholderTextColor="#999"
                    multiline
                    value={content}
                    onChangeText={setContent}
                />

                {image && (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: image }} style={styles.previewImage} />
                        <TouchableOpacity
                            style={styles.removeImageButton}
                            onPress={() => setImage(null)}
                        >
                            <IconSymbol name="xmark.circle.fill" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.toolbar}>
                    <TouchableOpacity onPress={pickImage} style={styles.toolbarButton}>
                        <IconSymbol name="photo.fill" size={24} color={theme.tint} />
                        <Text style={[styles.toolbarText, { color: theme.tint }]}>Agregar Foto</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    cancelText: {
        fontSize: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    postText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    imageContainer: {
        position: 'relative',
        marginTop: 20,
    },
    previewImage: {
        width: '100%',
        height: 300,
        borderRadius: 12,
    },
    removeImageButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    toolbar: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    toolbarButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
    },
    toolbarText: {
        marginLeft: 8,
        fontWeight: '600',
    },
});
