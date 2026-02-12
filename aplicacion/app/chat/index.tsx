import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import ChatList from '@/components/chat/ChatList';
import { Colors } from '@/constants/theme';

export default function ChatIndexPage() {
    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerTitle: 'Mensajes',
                    headerTintColor: Colors.brand.darkBlue,
                    headerStyle: { backgroundColor: '#fff' },
                    headerShadowVisible: false,
                }}
            />
            <ChatList />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
});
