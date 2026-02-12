import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, useWindowDimensions, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';

export default function AboutScreen() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isLargeScreen = width > 768;

    const renderSection = (title: string, children: React.ReactNode, index: number) => (
        <Animated.View
            entering={FadeInDown.delay(index * 100).springify()}
            style={styles.section}
        >
            <ThemedText type="subtitle" style={styles.sectionTitle}>{title}</ThemedText>
            {children}
        </Animated.View>
    );

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Hero Header */}
                    <View style={styles.headerContainer}>
                        <LinearGradient
                            colors={['#0F172A', '#1E3A8A']}
                            style={StyleSheet.absoluteFill}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        />
                        <View style={styles.navBar}>
                            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                                <IconSymbol name="arrow.left" size={24} color="#fff" />
                                <ThemedText style={styles.backText}>Volver</ThemedText>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.headerContent}>
                            <Image
                                source={require('@/assets/images/logo.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                            <ThemedText style={styles.tagline}>El Puente hacia el Trabajo del Futuro</ThemedText>
                            <ThemedText style={styles.headerDescription}>
                                Conectando talento real con oportunidades excepcionales.
                            </ThemedText>
                        </View>
                    </View>

                    <View style={[styles.contentContainer, isLargeScreen && styles.contentContainerLarge]}>

                        {renderSection("1. Nuestra Misión", (
                            <ThemedText style={styles.paragraph}>
                                En TalentoLab, partimos de una premisa clara: el talento es universal, pero las oportunidades no lo son.
                                Nuestra misión es cerrar esa brecha, democratizando el acceso al trabajo digno y de alta calidad.
                                Nos dedicamos a visibilizar la maestría de los profesionales técnicos, conectándolos con un mercado que reconoce, valora y paga justamente su experiencia.
                            </ThemedText>
                        ), 1)}

                        {renderSection("2. ¿Qué hacemos?", (
                            <>
                                <ThemedText style={[styles.paragraph, { marginBottom: 16 }]}>
                                    Transformamos la forma en que el mundo contrata y ofrece servicios técnicos, construyendo un ecosistema de confianza mutua:
                                </ThemedText>
                                <View style={styles.cardContainer}>
                                    <View style={styles.card}>
                                        <ThemedText style={styles.cardTitle}>Para el Profesional</ThemedText>
                                        <ThemedText style={styles.cardText}>
                                            Creamos una infraestructura digital que funciona como un socio estratégico. Te proporcionamos las herramientas para exhibir tu portafolio, gestionar tu agenda, asegurar tus pagos y escalar tu negocio hacia la era digital.
                                        </ThemedText>
                                    </View>
                                    <View style={styles.card}>
                                        <ThemedText style={styles.cardTitle}>Para el Cliente</ThemedText>
                                        <ThemedText style={styles.cardText}>
                                            Eliminamos la incertidumbre. Ofrecemos una plataforma intuitiva y segura para encontrar, en cuestión de minutos, al experto ideal en carpintería, electricidad, fontanería y múltiples oficios especializados.
                                        </ThemedText>
                                    </View>
                                </View>
                            </>
                        ), 2)}

                        {renderSection("3. ¿Por qué TalentoLab?", (
                            <>
                                <ThemedText style={styles.paragraph}>No somos un directorio común; somos un estándar de calidad.</ThemedText>
                                <View style={styles.listContainer}>
                                    <View style={styles.listItem}>
                                        <View style={styles.listTextContainer}>
                                            <ThemedText style={styles.listTitle}>Validación Real</ThemedText>
                                            <ThemedText style={styles.listText}>Perfiles verificados para tu tranquilidad.</ThemedText>
                                        </View>
                                    </View>
                                    <View style={styles.listItem}>
                                        <View style={styles.listTextContainer}>
                                            <ThemedText style={styles.listTitle}>Eficiencia</ThemedText>
                                            <ThemedText style={styles.listText}>Adiós a las llamadas sin respuesta; gestionamos la comunicación de punta a punta.</ThemedText>
                                        </View>
                                    </View>
                                    <View style={styles.listItem}>
                                        <View style={styles.listTextContainer}>
                                            <ThemedText style={styles.listTitle}>Impacto Social</ThemedText>
                                            <ThemedText style={styles.listText}>Al usar TalentoLab, estás apoyando el crecimiento de emprendedores locales y dignificando los oficios que construyen nuestra sociedad.</ThemedText>
                                        </View>
                                    </View>
                                </View>
                            </>
                        ), 3)}

                        {renderSection("4. Cómo funciona", (
                            <View style={styles.stepsContainer}>
                                <View style={styles.step}>
                                    <View style={styles.stepNumber}><ThemedText style={styles.stepNumberText}>1</ThemedText></View>
                                    <ThemedText style={styles.stepTitle}>Encuentra</ThemedText>
                                    <ThemedText style={styles.stepText}>Explora perfiles por especialidad, cercanía y calificaciones reales.</ThemedText>
                                </View>
                                <View style={styles.stepLine} />
                                <View style={styles.step}>
                                    <View style={styles.stepNumber}><ThemedText style={styles.stepNumberText}>2</ThemedText></View>
                                    <ThemedText style={styles.stepTitle}>Coordina</ThemedText>
                                    <ThemedText style={styles.stepText}>Chatea con el profesional, define los detalles y recibe un presupuesto.</ThemedText>
                                </View>
                                <View style={styles.stepLine} />
                                <View style={styles.step}>
                                    <View style={styles.stepNumber}><ThemedText style={styles.stepNumberText}>3</ThemedText></View>
                                    <ThemedText style={styles.stepTitle}>Finaliza</ThemedText>
                                    <ThemedText style={styles.stepText}>Realiza el pago seguro y valora el trabajo para ayudar a la comunidad.</ThemedText>
                                </View>
                            </View>
                        ), 4)}

                        {renderSection("5. Nuestros Valores", (
                            <View style={styles.gridContainer}>
                                {[
                                    { title: "Confianza Radical", text: "Transparencia total en cada contrato y reseña." },
                                    { title: "Excelencia Técnica", text: "Promovemos y certificamos la calidad en el servicio." },
                                    { title: "Seguridad Integral", text: "Un entorno blindado para pagos y datos." },
                                    { title: "Crecimiento Compartido", text: "Si nuestros profesionales prosperan, nuestra comunidad se fortalece." }
                                ].map((item, index) => (
                                    <View key={index} style={[styles.gridItem, isLargeScreen ? { width: '48%' } : { width: '100%' }]}>
                                        <ThemedText style={styles.gridTitle}>{item.title}</ThemedText>
                                        <ThemedText style={styles.gridText}>{item.text}</ThemedText>
                                    </View>
                                ))}
                            </View>
                        ), 5)}

                        {renderSection("6. Nuestra Visión", (
                            <ThemedText style={styles.visionText}>
                                Convertirnos en la plataforma líder donde cada hogar y empresa tenga acceso inmediato a manos expertas, y donde cada profesional técnico pueda vivir de su oficio con orgullo, estabilidad financiera y reconocimiento global.
                            </ThemedText>
                        ), 6)}

                    </View>
                </ScrollView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2E8F0', // Darker background for better contrast
    },
    scrollContent: {
        paddingBottom: 60,
    },
    headerContainer: {
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        overflow: 'hidden',
    },
    navBar: {
        position: 'absolute',
        top: 50,
        left: 24,
        zIndex: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    backText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    headerContent: {
        alignItems: 'center',
        marginTop: 20,
    },
    logo: {
        width: 180,
        height: 60,
        marginBottom: 16,
    },
    tagline: {
        color: Colors.brand.orange,
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 8,
        textAlign: 'center',
    },
    headerDescription: {
        fontSize: 20,
        color: '#fff',
        textAlign: 'center',
        fontWeight: '600',
        maxWidth: 300,
    },
    contentContainer: {
        padding: 24,
        marginTop: 0, // Removed negative margin to avoid overlap
    },
    contentContainerLarge: {
        maxWidth: 800,
        alignSelf: 'center',
        width: '100%',
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 22,
        color: Colors.brand.darkBlue,
        marginBottom: 16,
        fontWeight: 'bold',
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 26,
        color: '#475569',
    },
    cardContainer: {
        gap: 16,
    },
    card: {
        backgroundColor: '#F8FAFC',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
        marginTop: 12,
        marginBottom: 8,
    },
    cardText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#64748B',
    },
    listContainer: {
        gap: 16,
        marginTop: 8,
    },
    listItem: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'flex-start',
    },
    listTextContainer: {
        flex: 1,
    },
    listTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 4,
    },
    listText: {
        fontSize: 15,
        lineHeight: 22,
        color: '#64748B',
    },
    stepsContainer: {
        gap: 24,
        marginTop: 8,
    },
    step: {
        alignItems: 'center',
    },
    stepNumber: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.brand.orange,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    stepNumberText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    stepTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 8,
    },
    stepText: {
        fontSize: 15,
        textAlign: 'center',
        color: '#64748B',
        lineHeight: 22,
    },
    stepLine: {
        height: 1,
        backgroundColor: '#E2E8F0',
        width: '50%',
        alignSelf: 'center',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    gridItem: {
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    gridTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.brand.darkBlue,
        marginBottom: 8,
    },
    gridText: {
        fontSize: 13,
        lineHeight: 18,
        color: '#64748B',
    },
    visionText: {
        fontSize: 18,
        lineHeight: 30,
        color: '#334155',
        fontStyle: 'italic',
        textAlign: 'center',
        paddingHorizontal: 12,
    },
});
