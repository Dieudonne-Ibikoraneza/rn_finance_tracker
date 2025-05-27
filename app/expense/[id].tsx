import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { deleteExpense, getExpense } from '../services/api';
import { Expense } from '../types';

export default function ExpenseDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenseDetails();
  }, [id]);

  const fetchExpenseDetails = async () => {
    try {
      if (typeof id === 'string') {
        const data = await getExpense(id);
        setExpense(data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch expense details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!expense) return;
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(expense.id);
              Alert.alert('Success', 'Expense deleted successfully');
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete expense');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!expense) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text>Expense not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <View className="bg-blue-50 p-6 rounded-lg mb-6">
        <Text className="text-lg font-bold mb-2">{expense.name}</Text>
        <Text className="text-gray-700 mb-1">{expense.description}</Text>
        <Text className="text-gray-500 mb-1">Category: {expense.category || 'N/A'}</Text>
        <Text className="text-gray-500 mb-1">Date: {expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A'}</Text>
        <Text className="text-lg font-bold text-blue-600 mt-2">${expense.amount}</Text>
      </View>
      <TouchableOpacity
        className="bg-red-500 p-4 rounded-lg mt-6"
        onPress={handleDelete}
      >
        <Text className="text-white text-center font-bold">Delete Expense</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
} 