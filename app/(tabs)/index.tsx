import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { getAllExpenses } from '../services/api';
import { Expense } from '../types';

function isThisMonth(dateString?: string) {
  if (!dateString) return false;
  const date = new Date(dateString);
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

const chartConfig = {
  backgroundGradientFrom: '#151312',
  backgroundGradientTo: '#151312',
  color: (opacity = 1) => `rgba(171, 139, 255, ${opacity})`, // accent
  labelColor: (opacity = 1) => `rgba(214, 199, 255, ${opacity})`, // light-100
  barPercentage: 0.7,
  decimalPlaces: 2,
  style: { borderRadius: 16 },
  propsForLabels: { fontFamily: 'SpaceMono' },
};

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

  // Prepare data for bar chart (last 10 transactions)
  const last10 = expenses.slice(-10);
  const barLabels = last10.map(e => e.date ? new Date(e.date).toLocaleDateString() : 'Invalid');
  const barData = last10.map(e => {
    if (typeof e.amount === 'number') return e.amount;
    if (typeof e.amount === 'string') {
      const parsed = parseFloat((e.amount as string).replace(/[^0-9.\-]+/g, ''));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  });

  // Prepare data for pie chart (by category)
  const categoryMap: Record<string, number> = {};
  expenses.forEach(e => {
    const cat = e.category || 'undefined';
    let amount = 0;
    if (typeof e.amount === 'number') amount = e.amount;
    else if (typeof e.amount === 'string') {
      const parsed = parseFloat((e.amount as string).replace(/[^0-9.\-]+/g, ''));
      amount = isNaN(parsed) ? 0 : parsed;
    }
    categoryMap[cat] = (categoryMap[cat] || 0) + amount;
  });
  const pieData = Object.entries(categoryMap).map(([cat, value], i) => ({
    name: cat,
    amount: value,
    color: `hsl(${(i * 47) % 360}, 70%, 60%)`,
    legendFontColor: '#D6C7FF',
    legendFontSize: 13,
  })).filter(d => d.amount > 0);

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

        {/* Recent Expenses Bar Chart */}
        <View className="bg-dark-100 p-4 rounded-lg mb-6">
          <Text className="text-light-100 text-lg font-bold mb-2 font-['SpaceMono']">Recent Expenses</Text>
          <Text className="text-light-300 mb-2 font-['SpaceMono']">Your last 10 transactions</Text>
          {barData.length > 0 && (
            <BarChart
              data={{
                labels: barLabels,
                datasets: [{ data: barData }],
              }}
              width={Dimensions.get('window').width - 48}
              height={220}
              yAxisLabel="$"
              yAxisSuffix=""
              chartConfig={chartConfig}
              style={{ borderRadius: 16 }}
              fromZero
              showValuesOnTopOfBars
            />
          )}
        </View>

        {/* Expenses by Category Pie Chart */}
        <View className="bg-dark-100 p-4 rounded-lg mb-6">
          <Text className="text-light-100 text-lg font-bold mb-2 font-['SpaceMono']">Expenses by Category</Text>
          <Text className="text-light-300 mb-2 font-['SpaceMono']">Distribution of your spending</Text>
          {pieData.length > 0 && (
            <PieChart
              data={pieData.map(d => ({
                name: d.name,
                population: d.amount,
                color: d.color,
                legendFontColor: d.legendFontColor,
                legendFontSize: d.legendFontSize,
              }))}
              width={Dimensions.get('window').width - 48}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft={"15"}
              absolute
            />
          )}
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