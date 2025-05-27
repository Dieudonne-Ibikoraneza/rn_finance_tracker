import { MaterialIcons } from '@expo/vector-icons';
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
      <View className="flex-1 bg-primary justify-center items-center">
        <Text className="text-light-300">Loading...</Text>
      </View>
    );
  }

  if (!expense) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <Text className="text-light-300">Expense not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary p-4">
      <TouchableOpacity onPress={() => router.back()} className="mb-4" style={{ width: 40 }}>
        <MaterialIcons name="arrow-back" size={28} color="#D6C7FF" />
      </TouchableOpacity>
      <View className="bg-dark-100 p-6 rounded-lg mb-6">
        <Text className="text-lg font-bold mb-2 text-light-100">{expense.name}</Text>
        <Text className="text-light-300 mb-1">{expense.description}</Text>
        <Text className="text-light-300 mb-1">Category: <Text className="text-light-100">{expense.category || 'N/A'}</Text></Text>
        <Text className="text-light-300 mb-1">Date: <Text className="text-light-100">{expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A'}</Text></Text>
        <Text className="text-lg font-bold text-accent mt-2">${expense.amount}</Text>
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