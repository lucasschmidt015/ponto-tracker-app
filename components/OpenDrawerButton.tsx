import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';

const OpenDrawerButton = () => {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const navigation = useNavigation();

    return (
        <View>
            <TouchableOpacity
                onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                style={styles.floatingButton}
            >
                <Text style={{ color: isDarkMode ? '#fff' : '#000', fontSize: 35 }}>☰</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        top: 55,
        left: 15,
        padding: 5,
        borderRadius: 24,
        zIndex: 999,
    },
})

export default OpenDrawerButton;
