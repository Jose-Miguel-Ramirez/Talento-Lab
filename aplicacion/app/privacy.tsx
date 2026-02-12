import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Stack } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';

export default function PrivacyScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Política de Privacidad', headerBackTitle: 'Volver' }} />
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <ThemedText type="title" style={styles.title}>Política de Privacidad</ThemedText>
                    <ThemedText style={styles.lastUpdated}>Última actualización: Febrero 2026</ThemedText>
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.paragraph}>
                        En TalentoLab, valoramos y respetamos tu privacidad. Esta política describe cómo recopilamos, utilizamos y protegemos tu información personal.
                    </ThemedText>
                </View>

                <View style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>1. Información que recopilamos</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        Podemos recopilar información personal que nos proporcionas directamente, como tu nombre, dirección de correo electrónico, número de teléfono y ubicación cuando te registras o utilizas nuestros servicios.
                    </ThemedText>
                </View>

                <View style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>2. Uso de la información</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        Utilizamos tu información para proporcionar y mejorar nuestros servicios, conectarte con profesionales o clientes, procesar pagos y comunicarnos contigo sobre actualizaciones o promociones.
                    </ThemedText>
                </View>

                <View style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>3. Protección de datos</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos contra el acceso no autorizado, la pérdida o la alteración.
                    </ThemedText>
                </View>

                <View style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>4. Contacto</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        Si tienes preguntas sobre esta política, contáctanos en privacidad@talentolab.com.
                    </ThemedText>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    content: {
        padding: 24,
        paddingBottom: 40,
        maxWidth: 800,
        alignSelf: 'center',
        width: '100%',
    },
    header: {
        marginBottom: 32,
    },
    title: {
        marginBottom: 8,
        color: Colors.brand.darkBlue,
    },
    lastUpdated: {
        fontSize: 14,
        color: '#94A3B8',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        marginBottom: 12,
        color: Colors.brand.darkBlue,
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        color: '#334155',
        marginBottom: 16,
    },
});
