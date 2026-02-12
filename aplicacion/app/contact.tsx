import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Linking, Platform, useWindowDimensions, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Reuse Auth components for consistency, or standard TextInput if specialized behavior needed
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';

// Simple schema for contact form
const ContactSchema = z.object({
    name: z.string().min(2, 'El nombre es muy corto'),
    email: z.string().email('Correo inválido'),
    message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

type Contacttype = z.infer<typeof ContactSchema>;

export default function ContactScreen() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isLargeScreen = width > 768;
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const { control, handleSubmit, formState: { errors }, reset } = useForm<Contacttype>({
        resolver: zodResolver(ContactSchema),
        defaultValues: { name: '', email: '', message: '' }
    });

    const onSubmit = async (data: Contacttype) => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Contact Data:', data);
        setIsSubmitting(false);
        reset();
        // Here you would typically show a success modal or toast
        alert('¡Mensaje enviado! Nos pondremos en contacto contigo pronto.');
    };

    const handleOpenLink = (url: string) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <View style={styles.container}>
                {/* Background Pattern/Gradient */}
                <LinearGradient
                    colors={['#0F172A', '#1E3A8A']} // Dark, premium background
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Header Nav */}
                    <View style={styles.navBar}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <IconSymbol name="arrow.left" size={24} color="#fff" />
                            <ThemedText style={styles.backText}>Volver</ThemedText>
                        </TouchableOpacity>
                        <Image source={require('@/assets/images/logo.png')} style={styles.logo} contentFit="contain" />
                    </View>

                    <View style={[styles.contentGrid, isLargeScreen && styles.contentGridLarge]}>
                        {/* Left Column: Contact Info */}
                        <Animated.View
                            entering={FadeInDown.duration(800).springify()}
                            style={[styles.infoColumn, isLargeScreen && styles.infoColumnLarge]}
                        >
                            <ThemedText style={styles.tagline}>Hablemos</ThemedText>
                            <ThemedText style={styles.mainTitle}>Ponte en contacto con nuestro equipo</ThemedText>
                            <ThemedText style={styles.description}>
                                ¿Tienes dudas sobre TalentoLab? ¿Quieres ser parte de nuestra red de profesionales o necesitas ayuda técnica? Estamos aquí para escucharte.
                            </ThemedText>

                            <View style={styles.contactDetails}>
                                <TouchableOpacity style={styles.contactItem} onPress={() => handleOpenLink('mailto:contacto@talentolab.com')}>
                                    <View style={styles.iconBox}>
                                        <IconSymbol name="envelope.fill" size={24} color={Colors.brand.orange} />
                                    </View>
                                    <View>
                                        <ThemedText style={styles.contactLabel}>Correo Electrónico</ThemedText>
                                        <ThemedText style={styles.contactValue}>talentolabhn@gmail.com</ThemedText>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.contactItem} onPress={() => handleOpenLink('geo:0,0?q=Tegucigalpa')}>
                                    <View style={styles.iconBox}>
                                        <IconSymbol name="mappin.and.ellipse" size={24} color={Colors.brand.orange} />
                                    </View>
                                    <View>
                                        <ThemedText style={styles.contactLabel}>Ubicación</ThemedText>
                                        <ThemedText style={styles.contactValue}>Comayagua, Honduras</ThemedText>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.socialSection}>
                                <ThemedText style={styles.socialTitle}>Síguenos en redes</ThemedText>
                                <View style={styles.socialIcons}>
                                    {['facebook', 'instagram', 'linkedin', 'twitter'].map((social, index) => (
                                        // Placeholder icons, mapping logic handles generic names usually
                                        <TouchableOpacity key={social} style={styles.socialBtn}>
                                            <IconSymbol name="star.fill" size={20} color="#fff" />
                                            {/* Note: IconSymbol map might not have brand icons, using star as placeholder or generic link */}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </Animated.View>

                        {/* Right Column: Contact Form */}
                        <Animated.View
                            entering={FadeInRight.delay(200).duration(800).springify()}
                            style={[styles.formColumn, isLargeScreen && styles.formColumnLarge]}
                        >
                            <View style={styles.formCard}>
                                <ThemedText style={styles.formTitle}>Envíanos un mensaje</ThemedText>

                                <View style={styles.inputGroup}>
                                    <AuthInput
                                        control={control}
                                        name="name"
                                        label="Nombre Completo"
                                        icon="person.fill"
                                        placeholder="Tu nombre"
                                        error={errors.name?.message}
                                    />
                                    <AuthInput
                                        control={control}
                                        name="email"
                                        label="Correo Electrónico"
                                        icon="envelope.fill"
                                        placeholder="tucorreo@ejemplo.com"
                                        keyboardType="email-address"
                                        error={errors.email?.message}
                                    />
                                    {/* Custom multiline input reusing structure or adapting AuthInput */}
                                    <AuthInput
                                        control={control}
                                        name="message"
                                        label="Mensaje"
                                        icon="text.bubble.fill"
                                        placeholder="¿En qué podemos ayudarte?"
                                        multiline
                                        numberOfLines={4}
                                        style={{ height: 100, textAlignVertical: 'top' }}
                                        error={errors.message?.message}
                                    />
                                </View>

                                <AuthButton
                                    title="Enviar Mensaje"
                                    onPress={handleSubmit(onSubmit)}
                                    isLoading={isSubmitting}
                                    variant="secondary" // Orange/Brand color
                                />
                            </View>
                        </Animated.View>
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        marginBottom: 40,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    backText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    logo: {
        width: 120,
        height: 40,
    },
    contentGrid: {
        flexDirection: 'column',
        paddingHorizontal: 24,
        gap: 48,
    },
    contentGridLarge: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        maxWidth: 1200,
        alignSelf: 'center',
        width: '100%',
        paddingHorizontal: 60,
    },
    infoColumn: {
        flex: 1,
    },
    infoColumnLarge: {
        paddingRight: 60,
        paddingTop: 40,
    },
    formColumn: {
        flex: 1,
        width: '100%',
    },
    formColumnLarge: {
        minWidth: 400,
    },
    tagline: {
        color: Colors.brand.orange,
        fontWeight: '700',
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 12,
    },
    mainTitle: {
        fontSize: 40,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 16,
        lineHeight: 48,
    },
    description: {
        fontSize: 16,
        color: '#94A3B8',
        lineHeight: 26,
        marginBottom: 40,
    },
    contactDetails: {
        gap: 24,
        marginBottom: 48,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconBox: {
        width: 48,
        height: 48,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    contactLabel: {
        fontSize: 12,
        color: '#64748B',
        textTransform: 'uppercase',
        fontWeight: '700',
    },
    contactValue: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    socialSection: {
        marginTop: 'auto',
    },
    socialTitle: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
        marginBottom: 16,
    },
    socialIcons: {
        flexDirection: 'row',
        gap: 12,
    },
    socialBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 32,
        padding: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.2,
        shadowRadius: 40,
        elevation: 10,
    },
    formTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 24,
    },
});
