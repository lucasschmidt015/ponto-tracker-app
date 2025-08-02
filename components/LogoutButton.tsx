import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { AppDispatch } from '@/store';
import { useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { logout } from '@/store/slices/authSlice';

const LogoutButton = () => {
     const dispatch = useDispatch<AppDispatch>();
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <View>
            <TouchableOpacity
                onPress={handleLogout}
                style={styles.floatingButton}
            >
                <Ionicons
                    name="log-out-outline"
                    size={30}
                    color={isDarkMode ? '#fff' : '#000'}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        top: 55,
        right: 15,
        padding: 5,
        borderRadius: 24,
        zIndex: 999,
    },
})

export default LogoutButton;
