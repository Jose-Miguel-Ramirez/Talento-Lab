import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    FlatList,
    View,
    ActivityIndicator,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
    Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { Post } from '@/types/posts';
import { PostCard } from '@/components/feed/PostCard';
import { CreatePostModal } from '@/components/feed/CreatePostModal';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BackButton } from '@/components/ui/BackButton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';

export default function FeedScreen() {
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | undefined>(undefined);
    const [userId, setUserId] = useState<string | null>(null);
    const [isTalent, setIsTalent] = useState(false);
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select(`
          *,
          profiles (
            first_name,
            last_name,
            avatar_url
          )
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data as Post[]);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUserId(user.id);
            const metadataType = user.user_metadata?.user_type;
            if (metadataType) {
                setIsTalent(metadataType === 'talent');
                return;
            }

            const { data } = await supabase
                .from('profiles')
                .select('user_type')
                .eq('id', user.id)
                .single();

            setIsTalent(data?.user_type === 'talent');
        }
    };

    useEffect(() => {
        checkUser();
        fetchPosts();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        checkUser();
        fetchPosts();
    };

    const handleEditPost = (post: Post) => {
        setEditingPost(post);
        setModalVisible(true);
    };

    const handleDeletePost = (post: Post) => {
        Alert.alert(
            "Eliminar publicación",
            "¿Estás seguro de que quieres eliminar esta publicación?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const { error } = await supabase
                                .from('posts')
                                .delete()
                                .eq('id', post.id);

                            if (error) throw error;

                            // Optimistic update
                            setPosts(prev => prev.filter(p => p.id !== post.id));
                            Alert.alert('Éxito', 'Publicación eliminada.');
                        } catch (error) {
                            console.error('Error deleting post:', error);
                            Alert.alert('Error', 'No se pudo eliminar la publicación.');
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Premium Header with Gradient */}
            <View style={styles.headerContainer}>
                <LinearGradient
                    colors={['#fff', '#f8f9fa']}
                    style={styles.headerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                >
                    <View style={styles.headerContent}>
                        <BackButton onPress={() => router.push('/(tabs)/' as any)} />
                        <View style={styles.headerTextContainer}>
                            <ThemedText style={styles.headerTitle}>Muro de Talentos</ThemedText>
                            <ThemedText style={styles.headerSubtitle}>Descubre el mejor trabajo</ThemedText>
                        </View>
                        <View style={{ width: 40 }} />
                    </View>
                </LinearGradient>
            </View>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={Colors.brand.darkBlue} />
                </View>
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <PostCard
                            post={item}
                            currentUserId={userId}
                            onEdit={handleEditPost}
                            onDelete={handleDeletePost}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                />
            )}

            {isTalent && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => { setEditingPost(undefined); setModalVisible(true); }}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={[Colors.brand.orange, '#FB923C']}
                        style={styles.fabGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <IconSymbol name="plus" size={32} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            )}

            {userId && (
                <CreatePostModal
                    visible={modalVisible}
                    onClose={() => { setModalVisible(false); setEditingPost(undefined); }}
                    onPostCreated={onRefresh}
                    userId={userId}
                    existingPost={editingPost}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA', // Premium light grey background
    },
    headerContainer: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
        zIndex: 10,
        marginBottom: 8,
    },
    headerGradient: {
        paddingTop: Platform.OS === 'android' ? 40 : 0,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTextContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1F2937',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
        marginTop: 2,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
        paddingBottom: 100, // Space for FAB
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 24,
        shadowColor: Colors.brand.orange,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    fabGradient: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
