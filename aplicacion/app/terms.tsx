import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Stack } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';

export default function TermsScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Términos y Condiciones', headerBackTitle: 'Volver' }} />
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <ThemedText type="title" style={styles.title}>Términos de Servicio</ThemedText>
                    <ThemedText style={styles.lastUpdated}>Última actualización: Febrero 2026</ThemedText>
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.paragraph}>
                        Bienvenido a TalentoLab. Al acceder o utilizar nuestra plataforma, aceptas estar legalmente vinculado por estos términos y condiciones.
                    </ThemedText>
                </View>

                <View style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>1. Aceptación de los términos</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        Al registrarte y utilizar nuestros servicios, confirmas que tienes la edad legal para formar un contrato vinculante y que aceptas cumplir con estos términos.
                    </ThemedText>
                </View>

                <View style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>2. Responsabilidades del usuario</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        Te comprometes a proporcionar información veraz y a utilizar la plataforma de manera ética y legal. No debes utilizar el servicio para actividades fraudulentas o ilícitas.
                    </ThemedText>
                </View>

                <View style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>3. Servicios y Pagos</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        TalentoLab facilita la conexión entre clientes y profesionales. Los pagos por servicios realizados pueden procesarse a través de la plataforma, sujetos a nuestras políticas de tarifas y comisiones.
                    </ThemedText>
                </View>

                <View style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>4. Modificaciones</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos sobre cambios significativos a través de la plataforma o por correo electrónico.
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
