import { View, FlatList, StyleSheet, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ConversationPreview } from '@/types/chat';
import { ThemedText } from '@/components/themed-text';
import { Image } from 'expo-image';
import { Colors } from '@/constants/theme';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ChatList() {
    const router = useRouter();
    const [conversations, setConversations] = useState<ConversationPreview[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchConversations = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase.rpc('get_user_conversations', {
                current_user_id: user.id
            });

            if (error) throw error;

            setConversations(data || []);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchConversations();

        // Subscribe to changes in conversations (new messages)
        const subscription = supabase
            .channel('chat_list')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'messages',
            }, () => {
                fetchConversations();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchConversations();
    }, []);

    const handlePress = (id: string) => {
        router.push(`/chat/${id}` as any);
    };

    const renderItem = ({ item }: { item: ConversationPreview }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => handlePress(item.conversation_id)}
            activeOpacity={0.7}
        >
            {item.other_user_avatar ? (
                <Image source={{ uri: item.other_user_avatar }} style={styles.avatar} contentFit="cover" />
            ) : (
                <View style={styles.avatarPlaceholder}>
                    <ThemedText style={styles.avatarText}>
                        {item.other_user_name.charAt(0).toUpperCase()}
                    </ThemedText>
                </View>
            )}

            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <ThemedText style={styles.name} numberOfLines={1}>
                        {item.other_user_name}
                    </ThemedText>
                    {item.last_message_time && (
                        <ThemedText style={styles.time}>
                            {formatDistanceToNow(new Date(item.last_message_time), { addSuffix: true, locale: es })}
                        </ThemedText>
                    )}
                </View>

                <View style={styles.footer}>
                    <ThemedText style={styles.message} numberOfLines={1}>
                        {item.last_message_content || 'Iniciar conversación'}
                    </ThemedText>
                    {item.unread_count > 0 && (
                        <View style={styles.badge}>
                            <ThemedText style={styles.badgeText}>
                                {item.unread_count > 99 ? '99+' : item.unread_count}
                            </ThemedText>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.brand.darkBlue} />
            </View>
        );
    }

    if (conversations.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <ThemedText style={styles.emptyText}>No tienes mensajes aún.</ThemedText>
                <ThemedText style={styles.emptySubtext}>Explora talentos y comienza a chatear.</ThemedText>
            </View>
        );
    }

    return (
        <FlatList
            data={conversations}
            renderItem={renderItem}
            keyExtractor={(item) => item.conversation_id}
            contentContainerStyle={styles.listContent}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        />
    );
}

const styles = StyleSheet.create({
    listContent: {
        paddingVertical: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
    },
    itemContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.brand.darkBlue,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172A',
        flex: 1,
        marginRight: 8,
    },
    time: {
        fontSize: 12,
        color: '#64748B',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    message: {
        fontSize: 14,
        color: '#64748B',
        flex: 1,
        marginRight: 8,
    },
    badge: {
        backgroundColor: Colors.brand.darkBlue,
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        minWidth: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
