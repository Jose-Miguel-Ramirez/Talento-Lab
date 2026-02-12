import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { Image } from 'expo-image';
import { supabase } from '@/lib/supabase';
import { Comment } from '@/types/comments';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';

interface CommentsModalProps {
    visible: boolean;
    onClose: () => void;
    postId: string;
}

export function CommentsModal({ visible, onClose, postId }: CommentsModalProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    useEffect(() => {
        if (visible) {
            fetchComments();
        }
    }, [visible, postId]);

    const fetchComments = async () => {
        try {
            const { data, error } = await supabase
                .from('comments')
                .select(`
                    *,
                    profiles (
                        first_name,
                        last_name,
                        avatar_url
                    )
                `)
                .eq('post_id', postId)
                .order('created_at', { ascending: true }); // Oldest first

            if (error) throw error;
            setComments(data as Comment[]);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendComment = async () => {
        if (!newComment.trim()) return;

        setSending(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                Alert.alert('Error', 'Debes iniciar sesión para comentar.');
                return;
            }

            const { error } = await supabase
                .from('comments')
                .insert({
                    post_id: postId,
                    user_id: user.id,
                    content: newComment.trim(),
                });

            if (error) throw error;

            setNewComment('');
            fetchComments(); // Refresh list
        } catch (error) {
            console.error('Error sending comment:', error);
            Alert.alert('Error', 'No se pudo enviar el comentario.');
        } finally {
            setSending(false);
        }
    };

    const renderComment = ({ item }: { item: Comment }) => (
        <View style={styles.commentContainer}>
            {item.profiles?.avatar_url ? (
                <Image
                    source={{ uri: item.profiles.avatar_url }}
                    style={styles.avatar}
                    contentFit="cover"
                />
            ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Text style={styles.avatarInitial}>
                        {item.profiles?.first_name?.[0]?.toUpperCase() || 'U'}
                    </Text>
                </View>
            )}
            <View style={styles.commentContent}>
                <ThemedText style={styles.userName}>
                    {item.profiles?.first_name} {item.profiles?.last_name}
                </ThemedText>
                <ThemedText style={styles.commentText}>{item.content}</ThemedText>
            </View>
        </View>
    );

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={[styles.container, { backgroundColor: theme.background }]}
            >
                <View style={[styles.header, { borderBottomColor: '#ccc' }]}>
                    <ThemedText type="subtitle">Comentarios</ThemedText>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <IconSymbol name="xmark.circle.fill" size={24} color={theme.icon} />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={theme.tint} style={styles.loader} />
                ) : (
                    <FlatList
                        data={comments}
                        keyExtractor={(item) => item.id}
                        renderItem={renderComment}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <ThemedText style={{ color: '#999' }}>Aún no hay comentarios. ¡Sé el primero!</ThemedText>
                            </View>
                        }
                    />
                )}

                <View style={[styles.inputContainer, { borderTopColor: '#ccc', backgroundColor: theme.background }]}>
                    <TextInput
                        style={[styles.input, { backgroundColor: '#f0f0f0', color: '#000' }]}
                        placeholder="Escribe un comentario..."
                        placeholderTextColor="#666"
                        value={newComment}
                        onChangeText={setNewComment}
                        multiline
                    />
                    <TouchableOpacity
                        onPress={handleSendComment}
                        disabled={sending || !newComment.trim()}
                        style={[styles.sendButton, { opacity: sending || !newComment.trim() ? 0.5 : 1 }]}
                    >
                        {sending ? (
                            <ActivityIndicator size="small" color={theme.tint} />
                        ) : (
                            <IconSymbol name="paperplane.fill" size={24} color={theme.tint} />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    closeButton: {
        padding: 4,
    },
    loader: {
        marginTop: 20,
    },
    listContent: {
        padding: 16,
        paddingBottom: 20,
    },
    commentContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        backgroundColor: '#e1e1e1',
    },
    avatarPlaceholder: {
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitial: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    commentContent: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 10,
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 2,
        color: '#333',
    },
    commentText: {
        fontSize: 14,
        color: '#333',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    input: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 10,
        maxHeight: 100,
        fontSize: 16,
    },
    sendButton: {
        padding: 8,
    },
});
