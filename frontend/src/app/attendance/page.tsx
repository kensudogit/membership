'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { LogIn, Search, QrCode, Clock, Calendar, Filter } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface AttendanceRecord {
  id: number;
  memberId: number;
  memberCode: string;
  memberName: string;
  checkInTime: string;
  checkOutTime?: string;
  duration?: number;
  status: string;
}

export default function AttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchAttendance();
  }, [filterDate]);

  const fetchAttendance = async () => {
    try {
      const mockRecords: AttendanceRecord[] = Array.from({ length: 20 }, (_, i) => {
        const checkInTime = new Date();
        checkInTime.setHours(10 + (i % 8), Math.floor(Math.random() * 60), 0);
        const checkOutTime = i % 3 === 0 ? undefined : new Date(checkInTime);
        if (checkOutTime) {
          checkOutTime.setHours(checkOutTime.getHours() + Math.floor(Math.random() * 3) + 1);
        }
        return {
          id: i + 1,
          memberId: i + 1,
          memberCode: `MEM${String(i + 1).padStart(4, '0')}`,
          memberName: `会員${i + 1}`,
          checkInTime: checkInTime.toISOString(),
          checkOutTime: checkOutTime?.toISOString(),
          duration: checkOutTime
            ? Math.floor((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60))
            : undefined,
          status: checkOutTime ? 'CHECKED_OUT' : 'CHECKED_IN',
        };
      });
      setAttendanceRecords(mockRecords);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (memberCode: string) => {
    try {
      await apiClient.post('/api/attendance/check-in', { memberCode });
      fetchAttendance();
    } catch (error) {
      console.error('Failed to check in:', error);
    }
  };

  const handleCheckOut = async (memberCode: string) => {
    try {
      await apiClient.post('/api/attendance/check-out', { memberCode });
      fetchAttendance();
    } catch (error) {
      console.error('Failed to check out:', error);
    }
  };

  const filteredRecords = attendanceRecords.filter((record) => {
    const matchesSearch =
      record.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.memberCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    const recordDate = new Date(record.checkInTime).toISOString().split('T')[0];
    const matchesDate = filterDate === '' || recordDate === filterDate;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const currentVisitors = attendanceRecords.filter((r) => r.status === 'CHECKED_IN').length;
  const todayVisitors = attendanceRecords.filter((r) => {
    const recordDate = new Date(r.checkInTime).toISOString().split('T')[0];
    return recordDate === new Date().toISOString().split('T')[0];
  }).length;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 dark:from-gray-950 dark:via-teal-950 dark:to-green-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-400 dark:bg-teal-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-400 dark:bg-green-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-600 to-green-600 flex items-center justify-center shadow-2xl float relative overflow-hidden"
              whileHover={{ rotate: [0, -10, 10, 0] }}
            >
              <Image
                src="/PC.png"
                alt="PC"
                width={64}
                height={64}
                className="object-contain"
              />
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black mb-2 gradient-text from-teal-600 via-green-600 to-emerald-600 dark:from-teal-400 dark:via-green-400 dark:to-emerald-400">
                来場管理
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 font-light">
                会員の来場チェック・履歴管理
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <LogIn className="w-8 h-8 text-teal-600" />
              <span className="text-4xl font-black text-teal-600 dark:text-teal-400">
                {currentVisitors}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">現在の来場者数</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-green-600" />
              <span className="text-4xl font-black text-green-600 dark:text-green-400">
                {todayVisitors}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">本日の来場者数</p>
          </motion.div>
        </div>

        {/* Quick Check-In */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass rounded-3xl p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            クイックチェックイン
          </h2>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <QrCode className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-400 dark:text-teal-500 w-6 h-6 z-10" />
              <input
                type="text"
                placeholder="会員コードまたはQRコードをスキャン..."
                className="w-full pl-14 pr-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-xl font-bold shadow-2xl hover:shadow-teal-500/50 transition-all"
            >
              チェックイン
            </motion.button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-6 flex gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-400 dark:text-teal-500 w-6 h-6 z-10" />
            <input
              type="text"
              placeholder="会員名、会員コードで検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500/50 text-gray-900 dark:text-white"
            />
          </div>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500/50 text-gray-900 dark:text-white"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500/50 text-gray-900 dark:text-white"
          >
            <option value="all">全て</option>
            <option value="CHECKED_IN">入場中</option>
            <option value="CHECKED_OUT">退場済</option>
          </select>
        </motion.div>

        {/* Attendance Records */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-teal-200 border-t-teal-600 dark:border-teal-800 dark:border-t-teal-400"></div>
          </div>
        ) : (
          <div className="glass rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-teal-600 to-green-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">会員コード</th>
                    <th className="px-6 py-4 text-left font-semibold">会員名</th>
                    <th className="px-6 py-4 text-left font-semibold">入場時刻</th>
                    <th className="px-6 py-4 text-left font-semibold">退場時刻</th>
                    <th className="px-6 py-4 text-left font-semibold">滞在時間</th>
                    <th className="px-6 py-4 text-left font-semibold">ステータス</th>
                    <th className="px-6 py-4 text-left font-semibold">アクション</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record, index) => (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono font-semibold text-gray-900 dark:text-white">
                        {record.memberCode}
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">
                        {record.memberName}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {new Date(record.checkInTime).toLocaleString('ja-JP')}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {record.checkOutTime
                          ? new Date(record.checkOutTime).toLocaleString('ja-JP')
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {record.duration ? `${Math.floor(record.duration / 60)}時間${record.duration % 60}分` : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-bold ${
                            record.status === 'CHECKED_IN'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          }`}
                        >
                          {record.status === 'CHECKED_IN' ? '入場中' : '退場済'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {record.status === 'CHECKED_IN' ? (
                          <motion.button
                            onClick={() => handleCheckOut(record.memberCode)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                          >
                            チェックアウト
                          </motion.button>
                        ) : (
                          <span className="text-gray-400 text-sm">完了</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredRecords.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                来場記録が見つかりませんでした
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

