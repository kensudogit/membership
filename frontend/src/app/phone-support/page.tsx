'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Phone, Search, Clock, User, MessageSquare, Calendar, Filter } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface SupportCall {
  id: number;
  memberId?: number;
  memberCode?: string;
  memberName?: string;
  callerName: string;
  phoneNumber: string;
  callType: string;
  subject: string;
  description: string;
  callStartTime: string;
  callEndTime?: string;
  duration?: number;
  status: string;
  handledBy?: string;
  notes?: string;
}

export default function PhoneSupportPage() {
  const [calls, setCalls] = useState<SupportCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchCalls();
  }, [filterDate]);

  const fetchCalls = async () => {
    try {
      const mockCalls: SupportCall[] = Array.from({ length: 20 }, (_, i) => {
        const callStartTime = new Date();
        callStartTime.setHours(9 + (i % 8), Math.floor(Math.random() * 60), 0);
        const callEndTime = new Date(callStartTime);
        callEndTime.setMinutes(callEndTime.getMinutes() + Math.floor(Math.random() * 30) + 5);
        const duration = Math.floor((callEndTime.getTime() - callStartTime.getTime()) / 1000 / 60);
        return {
          id: i + 1,
          memberId: i % 3 === 0 ? undefined : i + 1,
          memberCode: i % 3 === 0 ? undefined : `MEM${String(i + 1).padStart(4, '0')}`,
          memberName: i % 3 === 0 ? undefined : `会員${i + 1}`,
          callerName: i % 3 === 0 ? `一般${i + 1}` : `会員${i + 1}`,
          phoneNumber: `090-${String(i + 1).padStart(4, '0')}-${String(i + 1).padStart(4, '0')}`,
          callType: ['問い合わせ', 'クレーム', '変更依頼', '解約申請', 'その他'][i % 5],
          subject: ['会費について', 'レッスン予約', '施設利用', '会員証発行', 'その他'][i % 5],
          description: `お問い合わせ内容${i + 1}`,
          callStartTime: callStartTime.toISOString(),
          callEndTime: callEndTime.toISOString(),
          duration,
          status: i % 4 === 0 ? 'COMPLETED' : i % 4 === 1 ? 'IN_PROGRESS' : i % 4 === 2 ? 'MISSED' : 'PENDING',
          handledBy: i % 4 !== 2 ? `スタッフ${(i % 3) + 1}` : undefined,
          notes: i % 4 === 0 ? '対応完了しました。' : undefined,
        };
      });
      setCalls(mockCalls);
    } catch (error) {
      console.error('Failed to fetch calls:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCalls = calls.filter((call) => {
    const matchesSearch =
      call.callerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.memberCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.phoneNumber.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || call.status === filterStatus;
    const matchesType = filterType === 'all' || call.callType === filterType;
    const callDate = new Date(call.callStartTime).toISOString().split('T')[0];
    const matchesDate = filterDate === '' || callDate === filterDate;
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const activeCalls = calls.filter((c) => c.status === 'IN_PROGRESS').length;
  const todayCalls = calls.filter((c) => {
    const callDate = new Date(c.callStartTime).toISOString().split('T')[0];
    return callDate === new Date().toISOString().split('T')[0];
  }).length;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 dark:from-gray-950 dark:via-rose-950 dark:to-pink-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-rose-400 dark:bg-rose-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-400 dark:bg-pink-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
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
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center shadow-2xl float relative overflow-hidden"
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
              <h1 className="text-3xl md:text-4xl font-black mb-2 gradient-text from-rose-600 via-pink-600 to-red-600 dark:from-rose-400 dark:via-pink-400 dark:to-red-400">
                電話サポート
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 font-light">
                電話での問い合わせ・サポート管理
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
              <Phone className="w-8 h-8 text-rose-600" />
              <span className="text-4xl font-black text-rose-600 dark:text-rose-400">
                {activeCalls}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">通話中</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-pink-600" />
              <span className="text-4xl font-black text-pink-600 dark:text-pink-400">
                {todayCalls}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">本日の対応件数</p>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6 flex gap-4 flex-wrap"
        >
          <div className="flex-1 relative min-w-[200px]">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-rose-400 dark:text-rose-500 w-6 h-6 z-10" />
            <input
              type="text"
              placeholder="名前、会員コード、電話番号で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-500/50 text-gray-900 dark:text-white"
            />
          </div>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-500/50 text-gray-900 dark:text-white"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-500/50 text-gray-900 dark:text-white"
          >
            <option value="all">全種類</option>
            <option value="問い合わせ">問い合わせ</option>
            <option value="クレーム">クレーム</option>
            <option value="変更依頼">変更依頼</option>
            <option value="解約申請">解約申請</option>
            <option value="その他">その他</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-500/50 text-gray-900 dark:text-white"
          >
            <option value="all">全ステータス</option>
            <option value="IN_PROGRESS">対応中</option>
            <option value="COMPLETED">完了</option>
            <option value="PENDING">保留</option>
            <option value="MISSED">不在</option>
          </select>
        </motion.div>

        {/* Calls List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-rose-200 border-t-rose-600 dark:border-rose-800 dark:border-t-rose-400"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCalls.map((call, index) => (
              <motion.div
                key={call.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="glass rounded-3xl p-6 hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-rose-500" />
                        <span className="font-bold text-gray-900 dark:text-white">
                          {call.callerName}
                        </span>
                        {call.memberCode && (
                          <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full font-semibold">
                            会員
                          </span>
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-bold ${
                          call.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : call.status === 'IN_PROGRESS'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : call.status === 'MISSED'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                        }`}
                      >
                        {call.status === 'COMPLETED'
                          ? '完了'
                          : call.status === 'IN_PROGRESS'
                            ? '対応中'
                            : call.status === 'MISSED'
                              ? '不在'
                              : '保留'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {call.phoneNumber} | {call.memberCode || '非会員'}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(call.callStartTime).toLocaleString('ja-JP')}
                      </span>
                      {call.duration && (
                        <span>通話時間: {call.duration}分</span>
                      )}
                      {call.handledBy && (
                        <span>対応: {call.handledBy}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="flex items-start gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-gray-500 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded font-semibold">
                          {call.callType}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {call.subject}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {call.description}
                      </p>
                      {call.notes && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                          <span className="font-semibold">備考: </span>
                          {call.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredCalls.length === 0 && (
              <div className="text-center py-20 glass rounded-3xl">
                <p className="text-2xl text-gray-500 dark:text-gray-400 font-medium">
                  電話記録が見つかりませんでした
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

