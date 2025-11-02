'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Building2, Search, MapPin, Users, DollarSign, Calendar, Plus, Edit2, Trash2, Save, ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';

interface Store {
  id: number;
  storeCode: string;
  storeName: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  openDate: string;
  status: string;
  totalMembers: number;
  monthlyRevenue: number;
}

export default function MultiStorePage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [formData, setFormData] = useState<Partial<Store>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const mockStores: Store[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        storeCode: `STORE${String(i + 1).padStart(3, '0')}`,
        storeName: ['本店', '新宿店', '渋谷店', '池袋店', '銀座店', '横浜店', '大阪店', '名古屋店'][i % 8] || `店舗${i + 1}`,
        address: `東京都${['千代田区', '新宿区', '渋谷区', '豊島区', '中央区'][i % 5]}${i + 1}丁目${i + 1}番${i + 1}号`,
        phone: `03-${String(1000 + i).padStart(4, '0')}-${String(1000 + i).padStart(4, '0')}`,
        email: `store${i + 1}@example.com`,
        manager: `店長${i + 1}`,
        openDate: new Date(2020 + (i % 4), i % 12, (i % 28) + 1).toISOString(),
        status: (() => {
          if (i % 5 === 0) return 'CLOSED';
          if (i % 5 === 1) return 'MAINTENANCE';
          return 'OPEN';
        })(),
        totalMembers: Math.floor(Math.random() * 500) + 100,
        monthlyRevenue: Math.floor(Math.random() * 5000000) + 1000000,
      }));
      setStores(mockStores);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.storeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || store.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // ページネーション計算
  const totalPages = Math.ceil(filteredStores.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStores = filteredStores.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const totalStores = stores.length;
  const openStores = stores.filter((s) => s.status === 'OPEN').length;
  const totalMembers = stores.reduce((sum, s) => sum + s.totalMembers, 0);
  const totalRevenue = stores.reduce((sum, s) => sum + s.monthlyRevenue, 0);

  const handleCreate = () => {
    setIsNew(true);
    setEditingId(null);
    setFormData({
      storeCode: '',
      storeName: '',
      address: '',
      phone: '',
      email: '',
      manager: '',
      openDate: new Date().toISOString().split('T')[0],
      status: 'OPEN',
      totalMembers: 0,
      monthlyRevenue: 0,
    });
  };

  const handleEdit = (store: Store) => {
    setEditingId(store.id);
    setIsNew(false);
    setFormData({
      ...store,
      openDate: new Date(store.openDate).toISOString().split('T')[0],
    });
  };

  const handleSave = async () => {
    try {
      if (isNew) {
        const newStore: Store = {
          id: Math.max(...stores.map((s) => s.id), 0) + 1,
          storeCode: formData.storeCode || '',
          storeName: formData.storeName || '',
          address: formData.address || '',
          phone: formData.phone || '',
          email: formData.email || '',
          manager: formData.manager || '',
          openDate: new Date(formData.openDate || new Date()).toISOString(),
          status: formData.status || 'OPEN',
          totalMembers: formData.totalMembers || 0,
          monthlyRevenue: formData.monthlyRevenue || 0,
        };
        setStores([...stores, newStore]);
      } else if (editingId) {
        setStores(
          stores.map((s) =>
            s.id === editingId
              ? {
                  ...s,
                  ...formData,
                  openDate: new Date(formData.openDate || s.openDate).toISOString(),
                }
              : s
          )
        );
      }
      setEditingId(null);
      setIsNew(false);
      setFormData({});
    } catch (error) {
      console.error('Failed to save store:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (globalThis.confirm('この店舗を削除しますか？')) {
      try {
        setStores(stores.filter((s) => s.id !== id));
      } catch (error) {
        console.error('Failed to delete store:', error);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsNew(false);
    setFormData({});
  };

  const updateFormData = (field: keyof Store, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50 dark:from-gray-950 dark:via-lime-950 dark:to-green-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-lime-400 dark:bg-lime-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
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
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lime-600 to-green-600 flex items-center justify-center shadow-2xl float relative overflow-hidden"
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
              <h1 className="text-3xl md:text-4xl font-black mb-2 gradient-text from-lime-600 via-green-600 to-emerald-600 dark:from-lime-400 dark:via-green-400 dark:to-emerald-400">
                多店舗展開機能
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 font-light">
                複数店舗の管理・店舗間データ連携・統計
              </p>
            </div>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            className="group relative flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-lime-600 to-green-600 text-white rounded-2xl shadow-2xl hover:shadow-lime-500/50 transition-all duration-300 overflow-hidden"
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
              <Building2 className="w-8 h-8 text-lime-600" />
              <span className="text-3xl font-black text-lime-600 dark:text-lime-400">
                {totalStores}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">総店舗数</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-black text-green-600 dark:text-green-400">
                {openStores}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">営業中</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
                {totalMembers.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">総会員数</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-emerald-600" />
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                ¥{totalRevenue.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">総売上</p>
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
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lime-400 dark:text-lime-500 w-6 h-6 z-10" />
            <input
              type="text"
              placeholder="店舗名、店舗コード、住所で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-lime-500/50 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-lime-500/50 text-gray-900 dark:text-white"
          >
            <option value="all">全て</option>
            <option value="OPEN">営業中</option>
            <option value="CLOSED">閉店</option>
            <option value="MAINTENANCE">メンテナンス中</option>
          </select>
        </motion.div>

        {/* Store Table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-lime-200 border-t-lime-600 dark:border-lime-800 dark:border-t-lime-400"></div>
          </div>
        ) : (
          <div className="glass rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-lime-600 to-green-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">店舗コード</th>
                    <th className="px-6 py-4 text-left font-semibold">店舗名</th>
                    <th className="px-6 py-4 text-left font-semibold">住所</th>
                    <th className="px-6 py-4 text-left font-semibold">電話番号</th>
                    <th className="px-6 py-4 text-left font-semibold">メール</th>
                    <th className="px-6 py-4 text-left font-semibold">店長</th>
                    <th className="px-6 py-4 text-left font-semibold">開店日</th>
                    <th className="px-6 py-4 text-left font-semibold">会員数</th>
                    <th className="px-6 py-4 text-left font-semibold">月間売上</th>
                    <th className="px-6 py-4 text-left font-semibold">ステータス</th>
                    <th className="px-6 py-4 text-left font-semibold">アクション</th>
                  </tr>
                </thead>
                <tbody>
                  {isNew && (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b-2 border-lime-500 bg-lime-50/50 dark:bg-lime-900/10"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={formData.storeCode || ''}
                          onChange={(e) => updateFormData('storeCode', e.target.value)}
                          placeholder="STORE001"
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={formData.storeName || ''}
                          onChange={(e) => updateFormData('storeName', e.target.value)}
                          placeholder="店舗名"
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={formData.address || ''}
                          onChange={(e) => updateFormData('address', e.target.value)}
                          placeholder="住所"
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="tel"
                          value={formData.phone || ''}
                          onChange={(e) => updateFormData('phone', e.target.value)}
                          placeholder="03-1234-5678"
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => updateFormData('email', e.target.value)}
                          placeholder="store@example.com"
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={formData.manager || ''}
                          onChange={(e) => updateFormData('manager', e.target.value)}
                          placeholder="店長名"
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="date"
                          value={formData.openDate || ''}
                          onChange={(e) => updateFormData('openDate', e.target.value)}
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={formData.totalMembers || 0}
                          onChange={(e) => updateFormData('totalMembers', Number(e.target.value))}
                          placeholder="0"
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={formData.monthlyRevenue || 0}
                          onChange={(e) => updateFormData('monthlyRevenue', Number(e.target.value))}
                          placeholder="0"
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={formData.status || 'OPEN'}
                          onChange={(e) => updateFormData('status', e.target.value)}
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-900 dark:text-white"
                        >
                          <option value="OPEN">営業中</option>
                          <option value="CLOSED">閉店</option>
                          <option value="MAINTENANCE">メンテナンス中</option>
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
                  {paginatedStores.map((store, index) => (
                    <motion.tr
                      key={store.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        editingId === store.id ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      {editingId === store.id ? (
                        <>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={formData.storeCode || ''}
                              onChange={(e) => updateFormData('storeCode', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={formData.storeName || ''}
                              onChange={(e) => updateFormData('storeName', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={formData.address || ''}
                              onChange={(e) => updateFormData('address', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="tel"
                              value={formData.phone || ''}
                              onChange={(e) => updateFormData('phone', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="email"
                              value={formData.email || ''}
                              onChange={(e) => updateFormData('email', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={formData.manager || ''}
                              onChange={(e) => updateFormData('manager', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="date"
                              value={formData.openDate || ''}
                              onChange={(e) => updateFormData('openDate', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              value={formData.totalMembers || 0}
                              onChange={(e) => updateFormData('totalMembers', Number(e.target.value))}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              value={formData.monthlyRevenue || 0}
                              onChange={(e) => updateFormData('monthlyRevenue', Number(e.target.value))}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={formData.status || 'OPEN'}
                              onChange={(e) => updateFormData('status', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-900 dark:text-white"
                            >
                              <option value="OPEN">営業中</option>
                              <option value="CLOSED">閉店</option>
                              <option value="MAINTENANCE">メンテナンス中</option>
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
                            {store.storeCode}
                          </td>
                          <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                            {store.storeName}
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">{store.address}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                            {store.phone}
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                            {store.email}
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                            {store.manager}
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                            {new Date(store.openDate).toLocaleDateString('ja-JP')}
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                            {store.totalMembers.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                            ¥{store.monthlyRevenue.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 text-xs rounded-full font-bold ${
                                (() => {
                                  if (store.status === 'OPEN') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
                                  if (store.status === 'CLOSED') return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
                                  return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
                                })()
                              }`}
                            >
                              {(() => {
                                if (store.status === 'OPEN') return '営業中';
                                if (store.status === 'CLOSED') return '閉店';
                                return 'メンテナンス中';
                              })()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <motion.button
                                onClick={() => handleEdit(store)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                onClick={() => handleDelete(store.id)}
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
            {filteredStores.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                店舗が見つかりませんでした
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredStores.length > 0 && (
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
                  className="px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-900 dark:text-white"
                >
                  <option value={5}>5件</option>
                  <option value={10}>10件</option>
                  <option value={20}>20件</option>
                  <option value={50}>50件</option>
                </select>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {startIndex + 1} - {Math.min(endIndex, filteredStores.length)} / {filteredStores.length}件
                </span>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 glass rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lime-100 dark:hover:bg-lime-900/20 transition-colors"
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
                          ? 'bg-gradient-to-r from-lime-600 to-green-600 text-white shadow-lg'
                          : 'glass text-gray-700 dark:text-gray-300 hover:bg-lime-100 dark:hover:bg-lime-900/20'
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
                  className="p-2 glass rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lime-100 dark:hover:bg-lime-900/20 transition-colors"
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

