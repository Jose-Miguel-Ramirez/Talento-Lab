import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from './icon-symbol';
import { Colors } from '@/constants/theme';

interface BackButtonProps {
    onPress?: () => void;
    color?: string;
    size?: number;
    style?: ViewStyle;
}

export function BackButton({ onPress, color = '#111827', size = 24, style }: BackButtonProps) {
    const router = useRouter();

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            router.back();
        }
    };

    return (
        <TouchableOpacity onPress={handlePress} style={[styles.backButton, style]}>
            <IconSymbol name="chevron.left" size={size} color={color} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
    },
});
