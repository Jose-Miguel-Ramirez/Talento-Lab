import { View, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BackButton } from '@/components/ui/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function PrivacyScreen() {
    const router = useRouter();
    const [profileVisibility, setProfileVisibility] = useState(true);
    const [shareData, setShareData] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <BackButton />
                <ThemedText style={styles.headerTitle}>Privacidad</ThemedText>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <ThemedText style={styles.sectionTitle}>Visibilidad</ThemedText>
                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <ThemedText style={styles.settingTitle}>Perfil Público</ThemedText>
                        <ThemedText style={styles.settingDescription}>Permitir que otros usuarios encuentren tu perfil en las búsquedas.</ThemedText>
                    </View>
                    <Switch
                        value={profileVisibility}
                        onValueChange={setProfileVisibility}
                        trackColor={{ false: '#767577', true: Colors.brand.darkBlue }}
                        thumbColor={'#f4f3f4'}
                    />
                </View>

                <View style={styles.separator} />

                <ThemedText style={styles.sectionTitle}>Datos</ThemedText>
                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <ThemedText style={styles.settingTitle}>Compartir Actividad</ThemedText>
                        <ThemedText style={styles.settingDescription}>Ayúdanos a mejorar compartiendo datos de uso anónimos.</ThemedText>
                    </View>
                    <Switch
                        value={shareData}
                        onValueChange={setShareData}
                        trackColor={{ false: '#767577', true: Colors.brand.darkBlue }}
                        thumbColor={'#f4f3f4'}
                    />
                </View>

                <View style={styles.separator} />

                <TouchableOpacity style={styles.linkButton}>
                    <ThemedText style={styles.linkText}>Política de Privacidad Completa</ThemedText>
                    <IconSymbol name="arrow.up.right" size={16} color={Colors.brand.darkBlue} />
                </TouchableOpacity>
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
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginTop: 8,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        marginBottom: 8,
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
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
    },
    linkText: {
        fontSize: 16,
        color: Colors.brand.darkBlue,
        fontWeight: '600',
    }
});
