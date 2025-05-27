import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { getAllExpenses } from '../services/api';
import { Expense } from '../types';

function isThisMonth(dateString?: string) {
  if (!dateString) return false;
  const date = new Date(dateString);
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

export default function DashboardScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [monthTotal, setMonthTotal] = useState(0);
  const [monthCount, setMonthCount] = useState(0);

  const fetchExpenses = async () => {
    try {
      const data = await getAllExpenses();
      setExpenses(data);
      const total = data.reduce((sum: number, expense: Expense) => {
        let amount = 0;
        if (typeof expense.amount === 'number') {
          amount = expense.amount;
        } else if (typeof expense.amount === 'string') {
          const parsed = parseFloat((expense.amount as string).replace(/[^0-9.\-]+/g, ''));
          amount = isNaN(parsed) ? 0 : parsed;
        } else {
          amount = 0;
        }
        return sum + amount;
      }, 0);
      setTotalExpenses(total);

      // This month
      let mTotal = 0;
      let mCount = 0;
      data.forEach((expense) => {
        if (isThisMonth(expense.date)) {
          let amount = 0;
          if (typeof expense.amount === 'number') {
            amount = expense.amount;
          } else if (typeof expense.amount === 'string') {
            const parsed = parseFloat((expense.amount as string).replace(/[^0-9.\-]+/g, ''));
            amount = isNaN(parsed) ? 0 : parsed;
          }
          mTotal += amount;
          mCount++;
        }
      });
      setMonthTotal(mTotal);
      setMonthCount(mCount);
    } catch (error) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [])
  );

  return (
    <ScrollView className="flex-1 bg-primary">
      <View className="p-4">
        {/* This Month Card */}
        <View className="bg-dark-100 p-6 rounded-lg mb-6">
          <Text className="text-light-300 text-base font-['SpaceMono'] mb-1 flex-row items-center">
            This Month
          </Text>
          <Text className="text-accent text-3xl font-bold font-['SpaceMono']">
            ${isNaN(monthTotal) ? '0.00' : monthTotal.toFixed(2)}
          </Text>
          <Text className="text-light-300 text-base mt-1 font-['SpaceMono']">
            {monthCount} transaction{monthCount === 1 ? '' : 's'}
          </Text>
        </View>

        {/* All Time Card */}
        <View className="bg-dark-100 p-6 rounded-lg mb-6">
          <Text className="text-light-300 text-lg font-['SpaceMono']">
            Total Expenses
          </Text>
          <Text className="text-accent text-3xl font-bold font-['SpaceMono']">
            ${isNaN(totalExpenses) ? '0.00' : totalExpenses.toFixed(2)}
          </Text>
          <Text className="text-light-300 text-base mt-4 font-['SpaceMono']">
            Total Transactions: <Text className="text-light-100 font-bold">{expenses.length}</Text>
          </Text>
        </View>

        <Text className="text-light-100 text-xl font-bold mb-4 font-['SpaceMono']">
          Recent Transactions
        </Text>

        {expenses.length === 0 && !loading && (
          <Text className="text-light-300 mb-4 font-['SpaceMono']">No recent transactions</Text>
        )}

        {expenses.slice(-5).reverse().map((expense) => (
          <TouchableOpacity
            key={expense.id}
            className="bg-dark-100 p-4 rounded-lg mb-3"
            onPress={() => router.push(`/expense/${expense.id}`)}
          >
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-light-100 font-['SpaceMono']">
                  {expense.name}
                </Text>
                <Text className="text-light-300 text-sm font-['SpaceMono']">
                  {expense.category}
                </Text>
              </View>
              <Text className="text-accent font-bold font-['SpaceMono']">
                ${(() => {
                  let amount = 0;
                  if (typeof expense.amount === 'number') {
                    amount = expense.amount;
                  } else if (typeof expense.amount === 'string') {
                    const parsed = parseFloat((expense.amount as string).replace(/[^0-9.\-]+/g, ''));
                    amount = isNaN(parsed) ? 0 : parsed;
                  } else {
                    amount = 0;
                  }
                  return amount.toFixed(2);
                })()}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          className="bg-accent p-4 rounded-lg mt-4"
          onPress={() => router.push('/new')}
        >
          <Text className="text-primary text-center font-bold font-['SpaceMono']">
            Add New Expense
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 