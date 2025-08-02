import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { useColorScheme } from 'react-native';

const Loading = () => {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const styles = getStyles(isDarkMode);

    return (
        <View>
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
                <Text style={styles.loadingText}>Loading</Text>
            </View>
        </View>
    );
}

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
    centerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    loadingText: {
        color: isDarkMode ? '#fff' : '#000',
        fontSize: 18,
    },
})


export default Loading;

