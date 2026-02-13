import Header from '@/components/my/header';
import { Stack } from 'expo-router';
import React, { Suspense } from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

export default function TabLayout() {
        
    const SCREEN_OPTIONS = {
        title: 'Menus',
        headerTransparent: true,
        // headerShown: false,
        // headerRight: () => <ThemeToggle />,
    };
        
    return (<>
        <Header title="Menus" />
        <Suspense fallback={
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#00ff00" />
            </View>}>
            <Stack  screenOptions={{ headerShown: false }} />
        </Suspense>
    </>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
});