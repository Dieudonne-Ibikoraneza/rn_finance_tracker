import AsyncStorage from '@react-native-async-storage/async-storage';

export const removeUser = async () => {
  await AsyncStorage.removeItem('user');
}; 