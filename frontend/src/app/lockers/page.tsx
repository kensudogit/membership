'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Lock, Search, Calendar, DollarSign, CheckCircle, XCircle, Plus, Edit2, Trash2, Save, ChevronLeft, ChevronRight } from 'lucide-react';

interface LockerContract {
  id: number;
  lockerNumber: string;
  memberId: number;
  memberCode: string;
  memberName: string;
  location: string;
  size: string;
  monthlyFee: number;
  contractDate: string;
  startDate: string;
  endDate?: string;
  status: string;
  remarks?: string;
}

export default function LockersPage() {
  const [lockers, setLockers] = useState<LockerContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [formData, setFormData] = useState<Partial<LockerContract>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchLockers();
  }, []);

  const fetchLockers = async () => {
    try {
      const mockLockers: LockerContract[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        lockerNumber: `L${String(i + 1).padStart(3, '0')}`,
        memberId: i + 1,
        memberCode: `MEM${String(i + 1).padStart(4, '0')}`,
        memberName: `会員${i + 1}`,
        location: ['1階', '2階', '3階', 'B1階'][i % 4],
        size: ['S', 'M', 'L'][i % 3],
        monthlyFee: 1000 + (i % 3) * 500,
        contractDate: new Date(2024, 0, i + 1).toISOString(),
        startDate: new Date(2024, 0, i + 1).toISOString(),
        endDate: (() => {
          if (i % 3 === 2) return undefined;
          return new Date(2025, 0, i + 1).toISOString();
        })(),
        status: (() => {
          if (i % 3 === 0) return 'ACTIVE';
          if (i % 3 === 1) return 'EXPIRED';
          return 'AVAILABLE';
        })(),
        remarks: i % 5 === 0 ? '要確認' : undefined,
      }));
      setLockers(mockLockers);
    } catch (error) {
      console.error('Failed to fetch lockers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLockers = lockers.filter((locker) => {
    const matchesSearch =
      locker.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      locker.memberCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      locker.lockerNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || locker.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // ページネーション計算
  const totalPages = Math.ceil(filteredLockers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLockers = filteredLockers.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const activeLockers = lockers.filter((l) => l.status === 'ACTIVE').length;
  const totalRevenue = lockers.filter((l) => l.status === 'ACTIVE').reduce((sum, l) => sum + l.monthlyFee, 0);
  const availableLockers = lockers.filter((l) => l.status === 'AVAILABLE').length;

  const handleCreate = () => {
    setIsNew(true);
    setEditingId(null);
    setFormData({
      lockerNumber: '',
      memberCode: '',
      memberName: '',
      location: '1階',
      size: 'M',
      monthlyFee: 1000,
      contractDate: new Date().toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      remarks: '',
    });
  };

  const handleEdit = (locker: LockerContract) => {
    setEditingId(locker.id);
    setIsNew(false);
    setFormData({
      ...locker,
      contractDate: new Date(locker.contractDate).toISOString().split('T')[0],
      startDate: new Date(locker.startDate).toISOString().split('T')[0],
      endDate: locker.endDate ? new Date(locker.endDate).toISOString().split('T')[0] : undefined,
    });
  };

  const handleSave = async () => {
    try {
      if (isNew) {
        const newLocker: LockerContract = {
          id: Math.max(...lockers.map((l) => l.id), 0) + 1,
          lockerNumber: formData.lockerNumber || '',
          memberId: Math.max(...lockers.map((l) => l.memberId), 0) + 1,
          memberCode: formData.memberCode || '',
          memberName: formData.memberName || '',
          location: formData.location || '1階',
          size: formData.size || 'M',
          monthlyFee: formData.monthlyFee || 1000,
          contractDate: new Date(formData.contractDate || new Date()).toISOString(),
          startDate: new Date(formData.startDate || new Date()).toISOString(),
          endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
          status: formData.status || 'ACTIVE',
          remarks: formData.remarks || undefined,
        };
        setLockers([...lockers, newLocker]);
      } else if (editingId) {
        setLockers(
          lockers.map((l) =>
            l.id === editingId
              ? {
                  ...l,
                  ...formData,
                  contractDate: new Date(formData.contractDate || l.contractDate).toISOString(),
                  startDate: new Date(formData.startDate || l.startDate).toISOString(),
                  endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
                }
              : l
          )
        );
      }
      setEditingId(null);
      setIsNew(false);
      setFormData({});
    } catch (error) {
      console.error('Failed to save locker:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (globalThis.confirm('このロッカー契約を削除しますか？')) {
      try {
        setLockers(lockers.filter((l) => l.id !== id));
      } catch (error) {
        console.error('Failed to delete locker:', error);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsNew(false);
    setFormData({});
  };

  const updateFormData = (field: keyof LockerContract, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-gray-950 dark:via-amber-950 dark:to-yellow-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-400 dark:bg-amber-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-400 dark:bg-yellow-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
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
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-yellow-600 flex items-center justify-center shadow-2xl float relative overflow-hidden"
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
              <h1 className="text-3xl md:text-4xl font-black mb-2 gradient-text from-amber-600 via-yellow-600 to-orange-600 dark:from-amber-400 dark:via-yellow-400 dark:to-orange-400">
                契約ロッカー管理
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 font-light">
                ロッカーの貸出・返却・契約管理
              </p>
            </div>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            className="group relative flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-2xl shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <Plus className="w-6 h-6 relative z-10" />
            <span className="font-bold text-lg relative z-10">新規登録</span>
          </motion.button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Lock className="w-8 h-8 text-amber-600" />
              <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
                {activeLockers}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">契約中</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-black text-green-600 dark:text-green-400">
                ¥{totalRevenue.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">月額収益</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
                {availableLockers}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">空きロッカー</p>
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
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-400 dark:text-amber-500 w-6 h-6 z-10" />
            <input
              type="text"
              placeholder="会員名、会員コード、ロッカー番号で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/50 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/50 text-gray-900 dark:text-white"
          >
            <option value="all">全て</option>
            <option value="ACTIVE">契約中</option>
            <option value="EXPIRED">期限切れ</option>
            <option value="AVAILABLE">空き</option>
          </select>
        </motion.div>

        {/* Locker Table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-600 dark:border-amber-800 dark:border-t-amber-400"></div>
          </div>
        ) : (
          <div className="glass rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">ロッカー番号</th>
                    <th className="px-6 py-4 text-left font-semibold">会員コード</th>
                    <th className="px-6 py-4 text-left font-semibold">会員名</th>
                    <th className="px-6 py-4 text-left font-semibold">場所</th>
                    <th className="px-6 py-4 text-left font-semibold">サイズ</th>
                    <th className="px-6 py-4 text-left font-semibold">月額料金</th>
                    <th className="px-6 py-4 text-left font-semibold">契約日</th>
                    <th className="px-6 py-4 text-left font-semibold">開始日</th>
                    <th className="px-6 py-4 text-left font-semibold">終了日</th>
                    <th className="px-6 py-4 text-left font-semibold">ステータス</th>
                    <th className="px-6 py-4 text-left font-semibold">アクション</th>
                  </tr>
                </thead>
                <tbody>
                  {isNew && (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b-2 border-amber-500 bg-amber-50/50 dark:bg-amber-900/10"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={formData.lockerNumber || ''}
                          onChange={(e) => updateFormData('lockerNumber', e.target.value)}
                          placeholder="L001"
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={formData.memberCode || ''}
                          onChange={(e) => updateFormData('memberCode', e.target.value)}
                          placeholder="MEM0001"
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={formData.memberName || ''}
                          onChange={(e) => updateFormData('memberName', e.target.value)}
                          placeholder="会員名"
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={formData.location || '1階'}
                          onChange={(e) => updateFormData('location', e.target.value)}
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                        >
                          <option value="1階">1階</option>
                          <option value="2階">2階</option>
                          <option value="3階">3階</option>
                          <option value="B1階">B1階</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={formData.size || 'M'}
                          onChange={(e) => updateFormData('size', e.target.value)}
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                        >
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={formData.monthlyFee || 0}
                          onChange={(e) => updateFormData('monthlyFee', Number(e.target.value))}
                          placeholder="1000"
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="date"
                          value={formData.contractDate || ''}
                          onChange={(e) => updateFormData('contractDate', e.target.value)}
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="date"
                          value={formData.startDate || ''}
                          onChange={(e) => updateFormData('startDate', e.target.value)}
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="date"
                          value={formData.endDate || ''}
                          onChange={(e) => updateFormData('endDate', e.target.value)}
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={formData.status || 'ACTIVE'}
                          onChange={(e) => updateFormData('status', e.target.value)}
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                        >
                          <option value="ACTIVE">契約中</option>
                          <option value="EXPIRED">期限切れ</option>
                          <option value="AVAILABLE">空き</option>
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
                  {paginatedLockers.map((locker, index) => (
                    <motion.tr
                      key={locker.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        editingId === locker.id ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      {editingId === locker.id ? (
                        <>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={formData.lockerNumber || ''}
                              onChange={(e) => updateFormData('lockerNumber', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={formData.memberCode || ''}
                              onChange={(e) => updateFormData('memberCode', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={formData.memberName || ''}
                              onChange={(e) => updateFormData('memberName', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={formData.location || '1階'}
                              onChange={(e) => updateFormData('location', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                            >
                              <option value="1階">1階</option>
                              <option value="2階">2階</option>
                              <option value="3階">3階</option>
                              <option value="B1階">B1階</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={formData.size || 'M'}
                              onChange={(e) => updateFormData('size', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                            >
                              <option value="S">S</option>
                              <option value="M">M</option>
                              <option value="L">L</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              value={formData.monthlyFee || 0}
                              onChange={(e) => updateFormData('monthlyFee', Number(e.target.value))}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="date"
                              value={formData.contractDate || ''}
                              onChange={(e) => updateFormData('contractDate', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="date"
                              value={formData.startDate || ''}
                              onChange={(e) => updateFormData('startDate', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="date"
                              value={formData.endDate || ''}
                              onChange={(e) => updateFormData('endDate', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={formData.status || 'ACTIVE'}
                              onChange={(e) => updateFormData('status', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                            >
                              <option value="ACTIVE">契約中</option>
                              <option value="EXPIRED">期限切れ</option>
                              <option value="AVAILABLE">空き</option>
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
                            {locker.lockerNumber}
                          </td>
                          <td className="px-6 py-4 font-mono font-semibold text-gray-900 dark:text-white">
                            {locker.memberCode}
                          </td>
                          <td className="px-6 py-4 text-gray-900 dark:text-white">
                            {locker.memberName}
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                            {locker.location}
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                            {locker.size}
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                            ¥{locker.monthlyFee.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                            {new Date(locker.contractDate).toLocaleDateString('ja-JP')}
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                            {new Date(locker.startDate).toLocaleDateString('ja-JP')}
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                            {locker.endDate ? new Date(locker.endDate).toLocaleDateString('ja-JP') : '-'}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 text-xs rounded-full font-bold ${
                                (() => {
                                  if (locker.status === 'ACTIVE') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
                                  if (locker.status === 'EXPIRED') return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
                                  return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
                                })()
                              }`}
                            >
                              {(() => {
                                if (locker.status === 'ACTIVE') return '契約中';
                                if (locker.status === 'EXPIRED') return '期限切れ';
                                return '空き';
                              })()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <motion.button
                                onClick={() => handleEdit(locker)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                onClick={() => handleDelete(locker.id)}
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
            {filteredLockers.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                ロッカー契約が見つかりませんでした
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredLockers.length > 0 && (
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
                  className="px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                >
                  <option value={5}>5件</option>
                  <option value={10}>10件</option>
                  <option value={20}>20件</option>
                  <option value={50}>50件</option>
                </select>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {startIndex + 1} - {Math.min(endIndex, filteredLockers.length)} / {filteredLockers.length}件
                </span>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 glass rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-colors"
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
                          ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg'
                          : 'glass text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/20'
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
                  className="p-2 glass rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-colors"
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

