import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/store';
import { restoreToken } from '@/store/slices/authSlice';
import type { AppDispatch } from '@/store';
import 'react-native-reanimated';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

import { useColorScheme } from '@/components/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(restoreToken());
  }, [dispatch]);

  return <>{children}</>;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  // Custom toast config for dark/light theme
  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{
          backgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
          borderLeftColor: colorScheme === 'dark' ? '#4ade80' : '#22c55e',
          borderLeftWidth: 5,
        }}
        text1Style={{ color: colorScheme === 'dark' ? '#fff' : '#222' }}
        text2Style={{ color: colorScheme === 'dark' ? '#ccc' : '#444' }}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{
          backgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
          borderLeftColor: colorScheme === 'dark' ? '#f87171' : '#ef4444',
          borderLeftWidth: 5,
        }}
        text1Style={{ color: colorScheme === 'dark' ? '#fff' : '#222' }}
        text2Style={{ color: colorScheme === 'dark' ? '#ccc' : '#444' }}
      />
    ),
    // ...add more types as needed
  };

  return (
    <Provider store={store}>
      <AuthInitializer>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </ThemeProvider>
        <Toast
          position="top"
          bottomOffset={50}
          visibilityTime={8000}
          autoHide={true}
          topOffset={50}
          config={toastConfig}
        />
      </AuthInitializer>
    </Provider>
  );
}
