'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { GraduationCap, Search, Calendar, Users, Clock, MapPin, Plus, Edit2, Trash2, Save, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';

interface Seminar {
  id: number;
  seminarCode: string;
  title: string;
  description: string;
  type: string;
  location: string;
  instructor: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  registeredCount: number;
  status: string;
  repeatPattern?: string;
  nextDate?: string;
}

export default function SeminarsPage() {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [formData, setFormData] = useState<Partial<Seminar>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchSeminars();
  }, []);

  const fetchSeminars = async () => {
    try {
      const mockSeminars: Seminar[] = Array.from({ length: 50 }, (_, i) => {
        const date = new Date(2024, 11, i + 1, 10 + (i % 8), 0);
        const types = ['セミナー', 'シンポジウム', 'ワークショップ', '講演会'];
        const patterns = ['WEEKLY', 'MONTHLY', 'DAILY', undefined];
        
        return {
          id: i + 1,
          seminarCode: `SEM${String(i + 1).padStart(3, '0')}`,
          title: `${types[i % 4]}: テーマ${i + 1}`,
          description: `${types[i % 4]}の説明文です。詳細な内容について説明します。`,
          type: types[i % 4],
          location: ['会議室A', '会議室B', 'ホール', 'オンライン'][i % 4],
          instructor: `講師${i + 1}`,
          date: date.toISOString(),
          startTime: `${String(10 + (i % 8)).padStart(2, '0')}:00`,
          endTime: `${String(12 + (i % 8)).padStart(2, '0')}:00`,
          capacity: 20 + (i % 10) * 5,
          registeredCount: Math.floor(Math.random() * 30) + 5,
          status: (() => {
            if (i % 5 === 0) return 'CANCELLED';
            if (i % 5 === 1) return 'COMPLETED';
            if (i % 5 === 2) return 'FULL';
            return 'OPEN';
          })(),
          repeatPattern: patterns[i % 4],
          nextDate: patterns[i % 4] ? new Date(date.getTime() + (patterns[i % 4] === 'WEEKLY' ? 7 : patterns[i % 4] === 'MONTHLY' ? 30 : 1) * 24 * 60 * 60 * 1000).toISOString() : undefined,
        };
      });
      setSeminars(mockSeminars);
    } catch (error) {
      console.error('Failed to fetch seminars:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSeminars = seminars.filter((seminar) => {
    const matchesSearch =
      seminar.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seminar.seminarCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seminar.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || seminar.status === filterStatus;
    const matchesType = filterType === 'all' || seminar.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  // ページネーション計算
  const totalPages = Math.ceil(filteredSeminars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSeminars = filteredSeminars.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterType]);

  const upcomingSeminars = seminars.filter((s) => s.status === 'OPEN').length;
  const totalParticipants = seminars.reduce((sum, s) => sum + s.registeredCount, 0);
  const totalCapacity = seminars.reduce((sum, s) => sum + s.capacity, 0);
  const attendanceRate = totalCapacity > 0 ? Math.round((totalParticipants / totalCapacity) * 100) : 0;

  const handleCreate = () => {
    setIsNew(true);
    setEditingId(null);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormData({
      seminarCode: '',
      title: '',
      description: '',
      type: 'セミナー',
      location: '会議室A',
      instructor: '',
      date: tomorrow.toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '12:00',
      capacity: 20,
      registeredCount: 0,
      status: 'OPEN',
      repeatPattern: undefined,
    });
  };

  const handleEdit = (seminar: Seminar) => {
    setEditingId(seminar.id);
    setIsNew(false);
    setFormData({
      ...seminar,
      date: new Date(seminar.date).toISOString().split('T')[0],
      nextDate: seminar.nextDate ? new Date(seminar.nextDate).toISOString().split('T')[0] : undefined,
    });
  };

  const handleSave = async () => {
    try {
      if (isNew) {
        const newSeminar: Seminar = {
          id: Math.max(...seminars.map((s) => s.id), 0) + 1,
          seminarCode: formData.seminarCode || '',
          title: formData.title || '',
          description: formData.description || '',
          type: formData.type || 'セミナー',
          location: formData.location || '会議室A',
          instructor: formData.instructor || '',
          date: new Date(formData.date || new Date()).toISOString(),
          startTime: formData.startTime || '10:00',
          endTime: formData.endTime || '12:00',
          capacity: formData.capacity || 20,
          registeredCount: formData.registeredCount || 0,
          status: formData.status || 'OPEN',
          repeatPattern: formData.repeatPattern || undefined,
          nextDate: formData.nextDate ? new Date(formData.nextDate).toISOString() : undefined,
        };
        setSeminars([...seminars, newSeminar]);
      } else if (editingId) {
        setSeminars(
          seminars.map((s) =>
            s.id === editingId
              ? {
                  ...s,
                  ...formData,
                  date: new Date(formData.date || s.date).toISOString(),
                  nextDate: formData.nextDate ? new Date(formData.nextDate).toISOString() : undefined,
                }
              : s
          )
        );
      }
      setEditingId(null);
      setIsNew(false);
      setFormData({});
    } catch (error) {
      console.error('Failed to save seminar:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (globalThis.confirm('このセミナーを削除しますか？')) {
      try {
        setSeminars(seminars.filter((s) => s.id !== id));
      } catch (error) {
        console.error('Failed to delete seminar:', error);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsNew(false);
    setFormData({});
  };

  const updateFormData = (field: keyof Seminar, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl float relative overflow-hidden"
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
              <h1 className="text-3xl md:text-4xl font-black mb-2 gradient-text from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                セミナー・シンポジウム運営管理
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 font-light">
                定期的に開催されるセミナー・シンポジウムの運営管理
              </p>
            </div>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            className="group relative flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <Plus className="w-6 h-6 relative z-10" />
            <span className="font-bold text-lg relative z-10">新規登録</span>
          </motion.button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-indigo-600" />
              <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {upcomingSeminars}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">開催予定</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-purple-600" />
              <span className="text-3xl font-black text-purple-600 dark:text-purple-400">
                {totalParticipants}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">総参加者数</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-black text-green-600 dark:text-green-400">
                {totalCapacity}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">総定員数</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-pink-600" />
              <span className="text-3xl font-black text-pink-600 dark:text-pink-400">
                {attendanceRate}%
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">出席率</p>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-6 flex gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400 dark:text-indigo-500 w-6 h-6 z-10" />
            <input
              type="text"
              placeholder="セミナー名、コード、講師名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/50 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/50 text-gray-900 dark:text-white"
          >
            <option value="all">全ての種類</option>
            <option value="セミナー">セミナー</option>
            <option value="シンポジウム">シンポジウム</option>
            <option value="ワークショップ">ワークショップ</option>
            <option value="講演会">講演会</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/50 text-gray-900 dark:text-white"
          >
            <option value="all">全てのステータス</option>
            <option value="OPEN">開催予定</option>
            <option value="FULL">満席</option>
            <option value="COMPLETED">終了</option>
            <option value="CANCELLED">キャンセル</option>
          </select>
        </motion.div>

        {/* Seminar Table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 dark:border-indigo-800 dark:border-t-indigo-400"></div>
          </div>
        ) : (
          <div className="glass rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">コード</th>
                    <th className="px-6 py-4 text-left font-semibold">タイトル</th>
                    <th className="px-6 py-4 text-left font-semibold">種類</th>
                    <th className="px-6 py-4 text-left font-semibold">場所</th>
                    <th className="px-6 py-4 text-left font-semibold">講師</th>
                    <th className="px-6 py-4 text-left font-semibold">日時</th>
                    <th className="px-6 py-4 text-left font-semibold">時間</th>
                    <th className="px-6 py-4 text-left font-semibold">定員</th>
                    <th className="px-6 py-4 text-left font-semibold">参加者</th>
                    <th className="px-6 py-4 text-left font-semibold">繰り返し</th>
                    <th className="px-6 py-4 text-left font-semibold">ステータス</th>
                    <th className="px-6 py-4 text-left font-semibold">アクション</th>
                  </tr>
                </thead>
                <tbody>
                  {isNew && (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b-2 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={formData.seminarCode || ''}
                          onChange={(e) => updateFormData('seminarCode', e.target.value)}
                          placeholder="SEM001"
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={formData.title || ''}
                          onChange={(e) => updateFormData('title', e.target.value)}
                          placeholder="タイトル"
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={formData.type || 'セミナー'}
                          onChange={(e) => updateFormData('type', e.target.value)}
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                        >
                          <option value="セミナー">セミナー</option>
                          <option value="シンポジウム">シンポジウム</option>
                          <option value="ワークショップ">ワークショップ</option>
                          <option value="講演会">講演会</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={formData.location || '会議室A'}
                          onChange={(e) => updateFormData('location', e.target.value)}
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                        >
                          <option value="会議室A">会議室A</option>
                          <option value="会議室B">会議室B</option>
                          <option value="ホール">ホール</option>
                          <option value="オンライン">オンライン</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={formData.instructor || ''}
                          onChange={(e) => updateFormData('instructor', e.target.value)}
                          placeholder="講師名"
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="date"
                          value={formData.date || ''}
                          onChange={(e) => updateFormData('date', e.target.value)}
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <input
                            type="time"
                            value={formData.startTime || '10:00'}
                            onChange={(e) => updateFormData('startTime', e.target.value)}
                            className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                          />
                          <span className="px-2 py-2">〜</span>
                          <input
                            type="time"
                            value={formData.endTime || '12:00'}
                            onChange={(e) => updateFormData('endTime', e.target.value)}
                            className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={formData.capacity || 20}
                          onChange={(e) => updateFormData('capacity', Number(e.target.value))}
                          placeholder="20"
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={formData.registeredCount || 0}
                          onChange={(e) => updateFormData('registeredCount', Number(e.target.value))}
                          placeholder="0"
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={formData.repeatPattern || ''}
                          onChange={(e) => updateFormData('repeatPattern', e.target.value || undefined)}
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                        >
                          <option value="">なし</option>
                          <option value="DAILY">毎日</option>
                          <option value="WEEKLY">毎週</option>
                          <option value="MONTHLY">毎月</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={formData.status || 'OPEN'}
                          onChange={(e) => updateFormData('status', e.target.value)}
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                        >
                          <option value="OPEN">開催予定</option>
                          <option value="FULL">満席</option>
                          <option value="COMPLETED">終了</option>
                          <option value="CANCELLED">キャンセル</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <motion.button
                            onClick={handleSave}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <Save className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={handleCancel}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                  {paginatedSeminars.map((seminar, index) => (
                    <motion.tr
                      key={seminar.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        editingId === seminar.id ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      {editingId === seminar.id ? (
                        <>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={formData.seminarCode || ''}
                              onChange={(e) => updateFormData('seminarCode', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={formData.title || ''}
                              onChange={(e) => updateFormData('title', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={formData.type || 'セミナー'}
                              onChange={(e) => updateFormData('type', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                            >
                              <option value="セミナー">セミナー</option>
                              <option value="シンポジウム">シンポジウム</option>
                              <option value="ワークショップ">ワークショップ</option>
                              <option value="講演会">講演会</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={formData.location || '会議室A'}
                              onChange={(e) => updateFormData('location', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                            >
                              <option value="会議室A">会議室A</option>
                              <option value="会議室B">会議室B</option>
                              <option value="ホール">ホール</option>
                              <option value="オンライン">オンライン</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={formData.instructor || ''}
                              onChange={(e) => updateFormData('instructor', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="date"
                              value={formData.date || ''}
                              onChange={(e) => updateFormData('date', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <input
                                type="time"
                                value={formData.startTime || '10:00'}
                                onChange={(e) => updateFormData('startTime', e.target.value)}
                                className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                              />
                              <span className="px-2 py-2">〜</span>
                              <input
                                type="time"
                                value={formData.endTime || '12:00'}
                                onChange={(e) => updateFormData('endTime', e.target.value)}
                                className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              value={formData.capacity || 20}
                              onChange={(e) => updateFormData('capacity', Number(e.target.value))}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              value={formData.registeredCount || 0}
                              onChange={(e) => updateFormData('registeredCount', Number(e.target.value))}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={formData.repeatPattern || ''}
                              onChange={(e) => updateFormData('repeatPattern', e.target.value || undefined)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                            >
                              <option value="">なし</option>
                              <option value="DAILY">毎日</option>
                              <option value="WEEKLY">毎週</option>
                              <option value="MONTHLY">毎月</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={formData.status || 'OPEN'}
                              onChange={(e) => updateFormData('status', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                            >
                              <option value="OPEN">開催予定</option>
                              <option value="FULL">満席</option>
                              <option value="COMPLETED">終了</option>
                              <option value="CANCELLED">キャンセル</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <motion.button
                                onClick={handleSave}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                              >
                                <Save className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                onClick={handleCancel}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                              >
                                <XCircle className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 font-mono font-semibold text-gray-900 dark:text-white">
                            {seminar.seminarCode}
                          </td>
                          <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                            {seminar.title}
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                            {seminar.type}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <MapPin className="w-4 h-4" />
                              <span>{seminar.location}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                            {seminar.instructor}
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                            {new Date(seminar.date).toLocaleDateString('ja-JP')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>{seminar.startTime} - {seminar.endTime}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                            {seminar.capacity}名
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {seminar.registeredCount}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                ({Math.round((seminar.registeredCount / seminar.capacity) * 100)}%)
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                            {seminar.repeatPattern ? (
                              <>
                                {seminar.repeatPattern === 'DAILY' ? '毎日' : 
                                 seminar.repeatPattern === 'WEEKLY' ? '毎週' : '毎月'}
                                {seminar.nextDate && (
                                  <div className="text-xs mt-1">
                                    次回: {new Date(seminar.nextDate).toLocaleDateString('ja-JP')}
                                  </div>
                                )}
                              </>
                            ) : '-'}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 text-xs rounded-full font-bold ${
                                (() => {
                                  if (seminar.status === 'OPEN') return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
                                  if (seminar.status === 'FULL') return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
                                  if (seminar.status === 'COMPLETED') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
                                  return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
                                })()
                              }`}
                            >
                              {(() => {
                                if (seminar.status === 'OPEN') return '開催予定';
                                if (seminar.status === 'FULL') return '満席';
                                if (seminar.status === 'COMPLETED') return '終了';
                                return 'キャンセル';
                              })()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <motion.button
                                onClick={() => handleEdit(seminar)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                onClick={() => handleDelete(seminar.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </td>
                        </>
                      )}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredSeminars.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                セミナーが見つかりませんでした
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredSeminars.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-6 glass rounded-2xl p-6"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  表示件数:
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                >
                  <option value={5}>5件</option>
                  <option value={10}>10件</option>
                  <option value={20}>20件</option>
                  <option value={50}>50件</option>
                </select>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {startIndex + 1} - {Math.min(endIndex, filteredSeminars.length)} / {filteredSeminars.length}件
                </span>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 glass rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-100 dark:hover:bg-indigo-900/20 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </motion.button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <motion.button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        currentPage === pageNum
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                          : 'glass text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/20'
                      }`}
                    >
                      {pageNum}
                    </motion.button>
                  );
                })}

                <motion.button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 glass rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-100 dark:hover:bg-indigo-900/20 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

