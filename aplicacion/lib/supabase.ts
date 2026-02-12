
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Polyfill only on native platforms
if (Platform.OS !== 'web') {
    require('react-native-url-polyfill/auto');
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase keys are missing! Check your .env file.');
}

// Custom storage adapter to handle SSR/Web environments where window is undefined
const updatedStorage = {
    getItem: (key: string) => {
        if (Platform.OS === 'web' && typeof window === 'undefined') {
            return Promise.resolve(null);
        }
        return AsyncStorage.getItem(key);
    },
    setItem: (key: string, value: string) => {
        if (Platform.OS === 'web' && typeof window === 'undefined') {
            return Promise.resolve();
        }
        return AsyncStorage.setItem(key, value);
    },
    removeItem: (key: string) => {
        if (Platform.OS === 'web' && typeof window === 'undefined') {
            return Promise.resolve();
        }
        return AsyncStorage.removeItem(key);
    },
};

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
    auth: {
        storage: updatedStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

/**
 * Helper to upload a file to Supabase Storage
 */
export async function uploadFile(
    uri: string,
    bucket: string,
    path: string,
    contentType: string = 'image/jpeg'
) {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const arrayBuffer = await new Response(blob).arrayBuffer();

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, arrayBuffer, {
                contentType,
                upsert: true,
            });

        if (error) {
            throw error;
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}
