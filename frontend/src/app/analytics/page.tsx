'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AnalyticsData {
  memberStats: {
    total: number;
    active: number;
    newThisMonth: number;
    growth: number;
  };
  salesStats: {
    total: number;
    thisMonth: number;
    growth: number;
    average: number;
  };
  attendanceData: Array<{
    date: string;
    count: number;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  monthlySales: Array<{
    month: string;
    sales: number;
  }>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // モックデータ
      const mockData: AnalyticsData = {
        memberStats: {
          total: 1234,
          active: 987,
          newThisMonth: 45,
          growth: 12.5,
        },
        salesStats: {
          total: 12345678,
          thisMonth: 2345678,
          growth: 8.3,
          average: 123456,
        },
        attendanceData: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(2024, 0, i + 1).toLocaleDateString('ja-JP', {
            month: 'short',
            day: 'numeric',
          }),
          count: Math.floor(Math.random() * 100) + 20,
        })),
        categoryData: [
          { name: 'プロテイン', value: 35, color: COLORS[0] },
          { name: 'ウェア', value: 25, color: COLORS[1] },
          { name: 'サプリメント', value: 20, color: COLORS[2] },
          { name: 'アクセサリー', value: 15, color: COLORS[3] },
          { name: 'その他', value: 5, color: COLORS[4] },
        ],
        monthlySales: Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2024, i, 1).toLocaleDateString('ja-JP', { month: 'short' }),
          sales: Math.floor(Math.random() * 5000000) + 1000000,
        })),
      };
      setData(mockData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-indigo-950 dark:to-purple-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 dark:border-indigo-800 dark:border-t-indigo-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-indigo-950 dark:to-purple-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-400 dark:bg-indigo-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <motion.div
                className="relative w-16 h-16 md:w-20 md:h-20"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/PC.png"
                  alt="PC"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </motion.div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black mb-3 gradient-text from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                  データ分析
                </h1>
                <p className="text-xl text-gray-700 dark:text-gray-300 font-light">
                  会員分析・売上分析・利用状況分析
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {(['week', 'month', 'year'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {(() => {
                    if (range === 'week') return '週';
                    if (range === 'month') return '月';
                    return '年';
                  })()}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-600" />
              <span
                className={`text-sm font-semibold ${
                  data.memberStats.growth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {data.memberStats.growth >= 0 ? '+' : ''}
                {data.memberStats.growth}%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {data.memberStats.total.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">総会員数</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              アクティブ: {data.memberStats.active.toLocaleString()} | 今月新規: {data.memberStats.newThisMonth}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-green-600" />
              <span
                className={`text-sm font-semibold ${
                  data.salesStats.growth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {data.salesStats.growth >= 0 ? '+' : ''}
                {data.salesStats.growth}%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              ¥{data.salesStats.total.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">総売上</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              今月: ¥{data.salesStats.thisMonth.toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              ¥{data.salesStats.average.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">平均売上</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {data.attendanceData.reduce((sum, d) => sum + d.count, 0)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">来場数（週）</p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              月別売上推移
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`¥${value.toLocaleString()}`, '売上']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#6366f1"
                  strokeWidth={2}
                  name="売上"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              カテゴリー別売上
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={data.categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.categoryData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Attendance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            来場数推移
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#6366f1" name="来場数" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}

