import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { LandingHeader } from './landing/LandingHeader';
import { HeroSection } from './landing/HeroSection';
import { ProblemSolutionSection } from './landing/ProblemSolutionSection';
import { TrustSection } from './landing/TrustSection';
import { CallToActionSection } from './landing/CallToActionSection';
import { NewsletterSection } from './landing/NewsletterSection';
import { LandingFooter } from './landing/LandingFooter';

export default function LandingPage() {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <LandingHeader />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <HeroSection />
                <ProblemSolutionSection />
                <TrustSection />
                <CallToActionSection />
                <NewsletterSection />
                <LandingFooter />
                <View style={{ height: insets.bottom }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        backgroundColor: '#F8FAFC',
    },
});
