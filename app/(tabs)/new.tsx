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
    if (!name || !amount || !description || !category) {
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
        { text: 'OK', onPress: () => router.replace('/expenses') },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary p-4">
      <View className="p-6 space-y-4 gap-4">
        <View>
          <Text className="mb-1 font-semibold text-light-100">Name <Text style={{color: 'red'}}>*</Text></Text>
          <TextInput
            className="bg-dark-200 text-light-100 p-4 rounded-lg"
            placeholder="Enter expense name"
            placeholderTextColor="#9CA4AB"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View>
          <Text className="mb-1 font-semibold text-light-100">Amount <Text style={{color: 'red'}}>*</Text></Text>
        <TextInput
          className="bg-dark-200 text-light-100 p-4 rounded-lg"
          placeholder="Amount"
          placeholderTextColor="#9CA4AB"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        </View>

        <View>
          <Text className="mb-1 font-semibold text-light-100">Description <Text style={{color: 'red'}}>*</Text></Text>
        <TextInput
          className="bg-dark-200 text-light-100 p-4 rounded-lg"
          placeholder="Description"
          placeholderTextColor="#9CA4AB"
          value={description}
          onChangeText={setDescription}
        />
        </View>

        <View>
          <Text className="mb-1 font-semibold text-light-100">Category <Text style={{color: 'red'}}>*</Text></Text>
        <TextInput
          className="bg-dark-200 text-light-100 p-4 rounded-lg"
          placeholder="Category"
          placeholderTextColor="#9CA4AB"
          value={category}
          onChangeText={setCategory}
        />
        </View>

        <View>
          <Text className="mb-1 font-semibold text-light-100">Date</Text>
        <TextInput
          className="bg-dark-200 text-light-100 p-4 rounded-lg"
          placeholder="Date (YYYY-MM-DD)"
          placeholderTextColor="#9CA4AB"
          value={date}
          onChangeText={setDate}
        />
        </View>
        <Text className='text-light-300'><Text style={{color: 'red'}}>* </Text>Required fields</Text>
        <TouchableOpacity
          className="bg-accent p-4 rounded-lg mt-4"
          onPress={handleAddExpense}
          disabled={loading}
        >
          <Text className="text-primary text-center font-bold">
            {loading ? 'Adding...' : 'Add Expense'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 