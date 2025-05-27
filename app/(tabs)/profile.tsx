import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '../types';

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    };
    fetchUser();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-primary p-4">
      <View className="bg-dark-100 rounded-xl p-6">
        {user ? (
          <>
            <Text className="text-light-300 mb-2">Username:</Text>
            <Text className="text-light-100 mb-4 font-bold">{user.username}</Text>
            <Text className="text-light-300 mb-2">User ID:</Text>
            <Text className="text-light-100 mb-4 font-bold">{user.id}</Text>
            <Text className="text-light-300 mb-2">Created At:</Text>
            <Text className="text-light-100 font-bold">{new Date(user.createdAt).toLocaleString()}</Text>
          </>
        ) : (
          <Text className="text-light-300">Loading...</Text>
        )}
      </View>
    </SafeAreaView>
  );
} 