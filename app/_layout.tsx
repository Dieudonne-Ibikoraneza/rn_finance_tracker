import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import "./globals.css";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await AsyncStorage.getItem('user');
      const inAuthGroup = segments[0] === '(auth)';
      if (!user && !inAuthGroup) {
        router.replace('/login');
      }
      setAuthChecked(true);
    };
    checkAuth();
  }, [segments]);

  if (!loaded || !authChecked) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#030014',
        },
        headerTintColor: '#D6C7FF',
        headerTitleStyle: {
          fontFamily: 'SpaceMono',
        },
      }}
    />
  );
}
