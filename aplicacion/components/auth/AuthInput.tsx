import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface AuthInputProps<T extends FieldValues> extends TextInputProps {
    control: Control<T>;
    name: Path<T>;
    label: string;
    icon: string;
    error?: string;
    isPassword?: boolean;
}

export function AuthInput<T extends FieldValues>({
    control,
    name,
    label,
    icon,
    error,
    isPassword,
    ...props
}: AuthInputProps<T>) {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <View style={styles.container}>
            <ThemedText style={styles.label}>{label}</ThemedText>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
                        <IconSymbol name={icon as any} size={20} color="#94A3B8" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholderTextColor="#94A3B8"
                            secureTextEntry={isPassword && !showPassword}
                            {...props}
                        />
                        {isPassword && (
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                <IconSymbol
                                    name={showPassword ? "eye.slash.fill" : "eye.fill"}
                                    size={20}
                                    color="#94A3B8"
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            />
            {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    inputError: {
        borderColor: '#EF4444',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1E293B',
        height: '100%',
    },
    eyeIcon: {
        padding: 4,
    },
    errorText: {
        fontSize: 12,
        color: '#EF4444',
        marginTop: 4,
        marginLeft: 4,
    },
});
