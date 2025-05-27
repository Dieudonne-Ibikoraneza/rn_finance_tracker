import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { loginUser } from '../services/api';
import { LoginCredentials } from '../types';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const credentials: LoginCredentials = { username, password };
      const user = await loginUser(credentials);
      if (user) {
        await AsyncStorage.setItem('user', JSON.stringify(user));
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', 'Invalid credentials');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-primary p-4 justify-center">
      <Text className="text-light-100 text-3xl font-bold mb-8 text-center font-['SpaceMono']">
        Personal Finance Tracker
      </Text>
      <View className="space-y-4 bg-dark-100 p-6 rounded-xl shadow-lg">
        <TextInput
          className="bg-dark-200 text-light-100 p-4 rounded-lg font-['SpaceMono'] border border-dark-200 mb-2"
          placeholder="Username"
          placeholderTextColor="#9CA4AB"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          className="bg-dark-200 text-light-100 p-4 rounded-lg font-['SpaceMono'] border border-dark-200 mb-2"
          placeholder="Password"
          placeholderTextColor="#9CA4AB"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          className="bg-accent p-4 rounded-lg mt-2"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#030014" />
          ) : (
            <Text className="text-primary text-center font-bold font-['SpaceMono']">
              Login
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
} 