import { View, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BackButton } from '@/components/ui/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function NotificationsScreen() {
    const router = useRouter();
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(true);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <BackButton />
                <ThemedText style={styles.headerTitle}>Notificaciones</ThemedText>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <ThemedText style={styles.settingTitle}>Notificaciones Push</ThemedText>
                        <ThemedText style={styles.settingDescription}>Recibe alertas sobre el estado de tus servicios en tu dispositivo.</ThemedText>
                    </View>
                    <Switch
                        value={pushEnabled}
                        onValueChange={setPushEnabled}
                        trackColor={{ false: '#767577', true: Colors.brand.darkBlue }}
                        thumbColor={'#f4f3f4'}
                    />
                </View>

                <View style={styles.separator} />

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <ThemedText style={styles.settingTitle}>Correos Electrónicos</ThemedText>
                        <ThemedText style={styles.settingDescription}>Recibe resúmenes y promociones en tu correo.</ThemedText>
                    </View>
                    <Switch
                        value={emailEnabled}
                        onValueChange={setEmailEnabled}
                        trackColor={{ false: '#767577', true: Colors.brand.darkBlue }}
                        thumbColor={'#f4f3f4'}
                    />
                </View>
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
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    settingInfo: {
        flex: 1,
        paddingRight: 16,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },
    separator: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 16,
    },
});
