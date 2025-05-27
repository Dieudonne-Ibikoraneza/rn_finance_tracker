import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createExpense } from '../services/api';

export default function AddExpenseScreen() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddExpense = async () => {
    if (!name || !amount || !description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await createExpense({
        name,
        amount: parseFloat(amount),
        description,
        category,
        date: date || new Date().toISOString(),
      });
      Alert.alert('Success', 'Expense added successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-6">Add New Expense</Text>
      <View className="space-y-4">
        <View>
          <Text className="mb-1 font-semibold text-gray-700">Name <Text style={{color: 'red'}}>*</Text></Text>
          <TextInput
            className="bg-gray-100 p-4 rounded-lg"
            placeholder="Enter expense name"
            value={name}
            onChangeText={setName}
          />
        </View>
        <TextInput
          className="bg-gray-100 p-4 rounded-lg"
          placeholder="Amount*"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <TextInput
          className="bg-gray-100 p-4 rounded-lg"
          placeholder="Description*"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          className="bg-gray-100 p-4 rounded-lg"
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
        />
        <TextInput
          className="bg-gray-100 p-4 rounded-lg"
          placeholder="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
        />
        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg mt-4"
          onPress={handleAddExpense}
          disabled={loading}
        >
          <Text className="text-white text-center font-bold">
            {loading ? 'Adding...' : 'Add Expense'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 