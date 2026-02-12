import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { supabase, uploadFile } from '@/lib/supabase';
import { Message, Conversation } from '@/types/chat';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Image } from 'expo-image';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { TouchableOpacity } from 'react-native';

export default function ChatScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [otherUser, setOtherUser] = useState<{ name: string; avatar: string | null } | null>(null);
    const flatListRef = useRef<FlatList>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        fetchConversationAndMessages();

        if (!id) return;

        const subscription = supabase
            .channel(`chat:${id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${id}`,
            }, (payload) => {
                const newMessage = payload.new as Message;

                setMessages((current) => {
                    // Deduplicate by ID
                    if (current.some(m => m.id === newMessage.id)) {
                        return current;
                    }
                    return [newMessage, ...current];
                });
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    // console.log('Subscribed to chat channel');
                }
            });

        return () => {
            subscription.unsubscribe();
        };
    }, [id]);

    const fetchConversationAndMessages = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setUserId(user.id);

            // Fetch conversation details
            const { data: convData, error: convError } = await supabase
                .from('conversations')
                .select('*')
                .eq('id', id)
                .single();

            if (convError || !convData) {
                console.error('Error fetching conversation:', convError);
                return;
            }

            setConversation(convData);

            // Identify other user
            const otherUserId = convData.client_id === user.id ? convData.talent_id : convData.client_id;

            // Fetch other user profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('first_name, last_name, avatar_url')
                .eq('id', otherUserId)
                .single();

            if (profileData) {
                setOtherUser({
                    name: `${profileData.first_name} ${profileData.last_name}`,
                    avatar: profileData.avatar_url,
                });
            }

            // Fetch messages
            const { data: msgData, error: msgError } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', id)
                .order('created_at', { ascending: false });

            if (msgError) throw msgError;

            setMessages(msgData || []);
        } catch (error) {
            console.error('Error in fetchConversationAndMessages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (content: string, media?: { uri: string; type: 'image' | 'video' }) => {
        if (!userId || !id) return;

        // 1. Optimistic Update
        const tempId = `temp-${Date.now()}`;
        const optimisticMessage: Message = {
            id: tempId,
            conversation_id: id as string,
            sender_id: userId,
            content: content || null,
            media_url: media?.uri || null, // Use local URI for immediate display
            media_type: media?.type,
            is_read: false,
            created_at: new Date().toISOString(),
        };

        setMessages((prev) => [optimisticMessage, ...prev]);

        try {
            let mediaUrl = null;
            if (media) {
                const path = `${id}/${Date.now()}_${userId}`;
                mediaUrl = await uploadFile(media.uri, 'chat-media', path);
            }

            // 2. Insert into DB
            const { data: newMessage, error } = await supabase
                .from('messages')
                .insert({
                    conversation_id: id,
                    sender_id: userId,
                    content: content || null,
                    media_url: mediaUrl,
                    media_type: media ? media.type : null,
                })
                .select()
                .single();

            if (error) throw error;

            // 3. Replace Optimistic Message with Real Message
            if (newMessage) {
                setMessages((prev) => {
                    // Check if the real message was already added by subscription
                    const exists = prev.some(m => m.id === newMessage.id);
                    if (exists) {
                        // If it exists, just remove the temp one
                        return prev.filter(m => m.id !== tempId);
                    }
                    // Otherwise replace temp with real
                    return prev.map(m => m.id === tempId ? newMessage : m);
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Remove optimistic message on error to avoid confusion
            setMessages((prev) => prev.filter(m => m.id !== tempId));
            alert('Error al enviar el mensaje. Intenta de nuevo.');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.brand.darkBlue} />
            </View>
        );
    }

    // Group messages by date
    const groupedMessages = messages.reduce((groups: { [key: string]: Message[] }, message) => {
        const date = new Date(message.created_at).toLocaleDateString();
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {});

    const sections = Object.keys(groupedMessages).map(date => ({
        title: date,
        data: groupedMessages[date],
    })).sort((a, b) => new Date(b.title).getTime() - new Date(a.title).getTime());

    // Flatten for FlatList but keep track of headers
    const flatListData: (Message | string)[] = [];
    sections.forEach(section => {
        flatListData.push(...section.data);
        flatListData.push(section.title);
    });

    const renderDateHeader = (date: string) => {
        const today = new Date().toLocaleDateString();
        const yesterday = new Date(Date.now() - 86400000).toLocaleDateString();
        let displayDate = date;

        if (date === today) displayDate = 'Hoy';
        else if (date === yesterday) displayDate = 'Ayer';

        return (
            <View style={styles.dateHeader}>
                <ThemedText style={styles.dateHeaderText}>{displayDate}</ThemedText>
            </View>
        );
    };

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <View style={styles.headerTitleContainer}>
                            {otherUser?.avatar ? (
                                <Image source={{ uri: otherUser.avatar }} style={styles.headerAvatar} />
                            ) : (
                                <View style={styles.headerAvatarPlaceholder}>
                                    <ThemedText style={styles.headerAvatarText}>
                                        {otherUser?.name.charAt(0)}
                                    </ThemedText>
                                </View>
                            )}
                            <ThemedText style={styles.headerName}>{otherUser?.name || 'Chat'}</ThemedText>
                        </View>
                    ),
                    headerBackTitle: '', // Replaces headerBackTitleVisible
                    headerTintColor: Colors.brand.darkBlue,
                }}
            />

            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={flatListData}
                    renderItem={({ item }) => {
                        if (typeof item === 'string') {
                            return renderDateHeader(item);
                        }
                        return (
                            <MessageBubble
                                content={item.content}
                                isOwn={item.sender_id === userId}
                                timestamp={item.created_at}
                                senderAvatar={!userId || item.sender_id === userId ? undefined : otherUser?.avatar || undefined}
                                mediaUrl={item.media_url}
                                mediaType={item.media_type}
                                isRead={item.is_read}
                            />
                        );
                    }}
                    keyExtractor={(item) => typeof item === 'string' ? item : item.id}
                    contentContainerStyle={styles.messagesList}
                    inverted
                />
                <ChatInput onSend={handleSend} />
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    messagesList: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    headerAvatarPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.brand.darkBlue,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    headerAvatarText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    headerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172A',
    },
    dateHeader: {
        alignItems: 'center',
        marginVertical: 16,
    },
    dateHeaderText: {
        backgroundColor: '#E2E8F0',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        fontSize: 12,
        color: '#64748B',
        overflow: 'hidden',
    },
});
