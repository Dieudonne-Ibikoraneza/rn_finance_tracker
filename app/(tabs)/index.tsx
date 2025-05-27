import axios from 'axios';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

export default function DashboardScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        'https://67ac71475853dff153dab929.mockapi/api/v1/expenses'
      );
      setExpenses(response.data);
      const total = response.data.reduce(
        (sum: number, expense: Expense) => sum + expense.amount,
        0
      );
      setTotalExpenses(total);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-primary">
      <View className="p-4">
        <View className="bg-dark-100 p-6 rounded-lg mb-6">
          <Text className="text-light-300 text-lg font-['SpaceMono']">
            Total Expenses
          </Text>
          <Text className="text-accent text-3xl font-bold font-['SpaceMono']">
            ${totalExpenses.toFixed(2)}
          </Text>
        </View>

        <Text className="text-light-100 text-xl font-bold mb-4 font-['SpaceMono']">
          Recent Transactions
        </Text>

        {expenses.slice(0, 5).map((expense) => (
          <TouchableOpacity
            key={expense.id}
            className="bg-dark-100 p-4 rounded-lg mb-3"
            onPress={() => router.push(`/expense/${expense.id}`)}
          >
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-light-100 font-['SpaceMono']">
                  {expense.description}
                </Text>
                <Text className="text-light-300 text-sm font-['SpaceMono']">
                  {expense.category}
                </Text>
              </View>
              <Text className="text-accent font-bold font-['SpaceMono']">
                ${expense.amount.toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          className="bg-accent p-4 rounded-lg mt-4"
          onPress={() => router.push('/expense/new')}
        >
          <Text className="text-primary text-center font-bold font-['SpaceMono']">
            Add New Expense
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 