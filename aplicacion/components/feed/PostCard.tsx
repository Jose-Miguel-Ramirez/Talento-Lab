import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { Post } from '@/types/posts';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { CommentsModal } from '@/components/feed/CommentsModal';

interface PostCardProps {
    post: Post;
    currentUserId?: string | null;
    onEdit?: (post: Post) => void;
    onDelete?: (post: Post) => void;
}

export function PostCard({ post, currentUserId, onEdit, onDelete }: PostCardProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(post.likes_count || 0);
    const [commentsVisible, setCommentsVisible] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const isAuthor = currentUserId === post.talent_id;

    const handleLike = async () => {
        const newLikedState = !liked;
        setLiked(newLikedState);
        setLikes(prev => newLikedState ? prev + 1 : prev - 1);

        try {
            if (newLikedState) {
                const { error } = await supabase.rpc('increment_likes', { post_id: post.id });
                if (error) throw error;
            } else {
                const { error } = await supabase.rpc('decrement_likes', { post_id: post.id });
                if (error) throw error;
            }
        } catch (error) {
            console.error('Error updating likes:', error);
            setLiked(!newLikedState);
            setLikes(prev => !newLikedState ? prev + 1 : prev - 1);
        }
    };

    return (
        <>
            <View style={[styles.card, { backgroundColor: theme.background }]}>
                <View style={styles.header}>
                    {post.profiles?.avatar_url ? (
                        <Image
                            source={{ uri: post.profiles.avatar_url }}
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={[styles.avatar, styles.avatarPlaceholder]}>
                            <Text style={styles.avatarInitial}>
                                {post.profiles?.first_name?.[0]?.toUpperCase() || 'U'}
                            </Text>
                        </View>
                    )}
                    <View style={styles.headerText}>
                        <Text style={[styles.userName, { color: theme.text }]}>
                            {post.profiles?.first_name} {post.profiles?.last_name}
                        </Text>
                        <Text style={[styles.date, { color: theme.icon }]}>
                            {new Date(post.created_at).toLocaleDateString()}
                        </Text>
                    </View>
                    {isAuthor && (
                        <View style={{ position: 'relative', zIndex: 100 }}>
                            <TouchableOpacity onPress={() => setShowOptions(!showOptions)} style={{ padding: 4 }}>
                                <IconSymbol name="ellipsis" size={20} color={theme.icon} />
                            </TouchableOpacity>
                            {showOptions && (
                                <View style={[styles.optionsMenu, { backgroundColor: theme.background, shadowColor: theme.text }]}>
                                    <TouchableOpacity
                                        style={styles.optionItem}
                                        onPress={() => { setShowOptions(false); onEdit?.(post); }}
                                    >
                                        <IconSymbol name="pencil" size={16} color={theme.text} />
                                        <Text style={[styles.optionText, { color: theme.text }]}>Editar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.optionItem}
                                        onPress={() => { setShowOptions(false); onDelete?.(post); }}
                                    >
                                        <IconSymbol name="trash.fill" size={16} color="#EF4444" />
                                        <Text style={[styles.optionText, { color: '#EF4444' }]}>Eliminar</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}
                </View>

                <Text style={[styles.content, { color: theme.text }]}>{post.content}</Text>

                {post.image_url && (
                    <Image
                        source={{ uri: post.image_url }}
                        style={styles.postImage}
                        resizeMode="cover"
                    />
                )}

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                        <IconSymbol
                            name={liked ? "heart.fill" : "heart"}
                            size={24}
                            color={liked ? "#ff3b30" : theme.icon}
                        />
                        <Text style={[styles.actionText, { color: theme.icon }]}>
                            {likes > 0 ? `${likes} Me gusta` : 'Me gusta'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={() => setCommentsVisible(true)}>
                        <IconSymbol name="bubble.right" size={22} color={theme.icon} />
                        <Text style={[styles.actionText, { color: theme.icon }]}>Comentar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <CommentsModal
                visible={commentsVisible}
                onClose={() => setCommentsVisible(false)}
                postId={post.id}
            />
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 20,
        borderRadius: 24,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
        backgroundColor: '#f0f0f0',
    },
    avatarPlaceholder: {
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitial: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    headerText: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 2,
    },
    date: {
        fontSize: 12,
    },
    content: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 16,
    },
    postImage: {
        width: '100%',
        height: 250,
        borderRadius: 16,
        marginBottom: 16,
    },
    footer: {
        flexDirection: 'row',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    actionText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
    },
    optionsMenu: {
        position: 'absolute',
        top: 30,
        right: 0,
        width: 120,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 8,
        elevation: 10, // Higher than card
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        zIndex: 9999, // Ensure it's on top
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        gap: 8,
    },
    optionText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
