import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface ChatInputProps {
    onSend: (message: string) => Promise<void>;
    disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        if (!message.trim() || sending) return;

        setSending(true);
        try {
            await onSend(message.trim());
            setMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setSending(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Escribe un mensaje..."
                placeholderTextColor="#94A3B8"
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={500}
                editable={!disabled && !sending}
            />
            <TouchableOpacity
                style={[
                    styles.sendButton,
                    (!message.trim() || sending || disabled) && styles.sendButtonDisabled
                ]}
                onPress={handleSend}
                disabled={!message.trim() || sending || disabled}
            >
                {sending ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <IconSymbol name="arrow.up" size={20} color="#fff" />
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    input: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        paddingTop: 10, // Ensure multiline text starts at top
        maxHeight: 100,
        fontSize: 15,
        color: '#1E293B',
        marginRight: 10,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.brand.darkBlue,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 0, // Align with bottom of input
    },
    sendButtonDisabled: {
        backgroundColor: '#CBD5E1',
    },
});
