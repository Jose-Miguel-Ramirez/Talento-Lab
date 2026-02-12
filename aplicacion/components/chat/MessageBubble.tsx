import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface MessageBubbleProps {
    content: string | null;
    isOwn: boolean;
    timestamp: string;
    senderAvatar?: string;
    mediaUrl?: string | null;
    mediaType?: 'image' | 'video' | 'file' | null;
    isRead?: boolean;
}

export default function MessageBubble({ content, isOwn, timestamp, senderAvatar, mediaUrl, mediaType, isRead }: MessageBubbleProps) {
    const formattedTime = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <Animated.View
            entering={FadeInUp.springify()}
            style={[
                styles.container,
                isOwn ? styles.ownContainer : styles.otherContainer
            ]}
        >
            {!isOwn && senderAvatar && (
                <Image
                    source={{ uri: senderAvatar }}
                    style={styles.avatar}
                    contentFit="cover"
                />
            )}

            <View style={[
                styles.bubble,
                isOwn ? styles.ownBubble : styles.otherBubble
            ]}>
                {mediaUrl && mediaType === 'image' && (
                    <Image
                        source={{ uri: mediaUrl }}
                        style={styles.mediaImage}
                        contentFit="cover"
                        transition={200}
                    />
                )}

                {content && (
                    <ThemedText style={[
                        styles.text,
                        isOwn ? styles.ownText : styles.otherText
                    ]}>
                        {content}
                    </ThemedText>
                )}

                <View style={styles.footer}>
                    <ThemedText style={[
                        styles.time,
                        isOwn ? styles.ownTime : styles.otherTime
                    ]}>
                        {formattedTime}
                    </ThemedText>
                    {isOwn && (
                        <IconSymbol
                            name="checkmark.circle.fill"
                            size={12}
                            color={isRead ? '#34D399' : 'rgba(255, 255, 255, 0.7)'}
                            style={styles.checkIcon}
                        />
                    )}
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: 12,
        maxWidth: '80%',
        alignItems: 'flex-end',
    },
    ownContainer: {
        alignSelf: 'flex-end',
        flexDirection: 'row-reverse',
    },
    otherContainer: {
        alignSelf: 'flex-start',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    bubble: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        maxWidth: '100%',
    },
    ownBubble: {
        backgroundColor: Colors.brand.darkBlue,
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: '#F1F5F9', // slate-100
        borderBottomLeftRadius: 4,
    },
    text: {
        fontSize: 15,
        lineHeight: 22,
    },
    ownText: {
        color: '#FFFFFF',
    },
    otherText: {
        color: '#1E293B', // slate-800
    },
    time: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    ownTime: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    otherTime: {
        color: '#94A3B8', // slate-400
    },
    mediaImage: {
        width: 200,
        height: 150,
        borderRadius: 12,
        marginBottom: 4,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 4,
        alignSelf: 'flex-end',
        gap: 4,
    },
    checkIcon: {
        marginLeft: 2,
    },
});
