import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { deleteExpense, getAllExpenses } from '../services/api';
import { Expense } from '../types';
// You need to create this utility for removing user from AsyncStorage
import { removeUser } from '../utils/auth';

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  const fetchExpenses = async () => {
    try {
      const data = await getAllExpenses();
      setExpenses(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [])
  );

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await deleteExpense(expenseId);
      setExpenses(expenses.filter(expense => expense.id !== expenseId));
      Alert.alert('Success', 'Expense deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete expense');
    }
  };

  const handleLogout = async () => {
    await removeUser();
    router.replace('/login');
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <TouchableOpacity
      className="bg-dark-100 p-4 rounded-lg mb-2 shadow-sm"
      onPress={() => router.push(`/expense/${item.id}`)}
    >
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-lg font-semibold text-light-100">{item.name}</Text>
          <Text className="text-light-300">{item.description}</Text>
        </View>
        <View className="items-end">
          <Text className="text-lg font-bold text-accent">${item.amount}</Text>
          <Text className="text-light-300 text-sm">
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <TouchableOpacity
        style={{ position: 'absolute', top: -45, right: 20, zIndex: 10 }}
        onPress={handleLogout}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MaterialIcons name="logout" size={28} color="#ef4444" />
      </TouchableOpacity>
      {loading ? (
        <View className="flex-1 justify-center items-center bg-primary">
          <Text className="text-light-300">Loading expenses...</Text>
        </View>
      ) : (
        <View className="flex-1 bg-primary">
          <FlatList
            data={expenses}
            renderItem={renderExpenseItem}
            keyExtractor={(item) => item.id}
            className="px-4"
            contentContainerStyle={{
              paddingTop: 16,
              paddingBottom: insets.bottom,
            }}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center p-4">
                <Text className="text-light-300">No expenses found</Text>
              </View>
            }
            ListFooterComponent={
              <View style={{ height: 80 + insets.bottom }} />
            }
          />

          <View className="absolute bottom-8 right-8">
            <TouchableOpacity
              className="bg-blue-500 w-14 h-14 rounded-full justify-center items-center shadow-lg"
              onPress={() => router.push('/new')}
            >
              <Text className="text-white text-3xl">+</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
} 