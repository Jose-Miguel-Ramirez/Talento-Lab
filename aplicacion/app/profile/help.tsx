import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BackButton } from '@/components/ui/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HelpScreen() {
    const router = useRouter();

    const FAQItem = ({ question, answer }: { question: string, answer: string }) => (
        <View style={styles.faqItem}>
            <ThemedText style={styles.question}>{question}</ThemedText>
            <ThemedText style={styles.answer}>{answer}</ThemedText>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <BackButton />
                <ThemedText style={styles.headerTitle}>Ayuda</ThemedText>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <ThemedText style={styles.sectionTitle}>Preguntas Frecuentes</ThemedText>

                <FAQItem
                    question="¿Cómo contrato un servicio?"
                    answer="Simplemente busca el servicio que necesitas en el dashboard, selecciona un profesional y envía una solicitud."
                />

                <FAQItem
                    question="¿Es seguro?"
                    answer="Sí, todos nuestros profesionales pasan por un proceso de verificación de identidad y antecedentes."
                />

                <FAQItem
                    question="¿Cómo pago?"
                    answer="Próximamente habilitaremos pagos en línea. Por el momento, el pago se coordina directamente con el profesional."
                />

                <ThemedText style={styles.sectionTitle}>Contacto</ThemedText>
                <View style={styles.contactCard}>
                    <IconSymbol name="envelope.fill" size={24} color={Colors.brand.darkBlue} />
                    <View style={{ flex: 1 }}>
                        <ThemedText style={styles.contactTitle}>Soporte</ThemedText>
                        <ThemedText style={styles.contactText}>soporte@talentolab.com</ThemedText>
                    </View>
                </View>
            </ScrollView>
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
        fontSize: 18,
        fontWeight: '700',
        color: Colors.brand.darkBlue,
        marginBottom: 16,
        marginTop: 8,
    },
    faqItem: {
        marginBottom: 20,
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 12,
    },
    question: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    answer: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#EEF2FF',
        borderRadius: 16,
        gap: 16,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    contactText: {
        fontSize: 14,
        color: Colors.brand.darkBlue,
    },
});
