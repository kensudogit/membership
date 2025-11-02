'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CreditCard, Search, Calendar, DollarSign, CheckCircle, XCircle, Shield, Plus, Edit2, Trash2, Save, ChevronLeft, ChevronRight } from 'lucide-react';

interface CreditBilling {
  id: number;
  memberId: number;
  memberCode: string;
  memberName: string;
  cardBrand: string;
  last4Digits: string;
  amount: number;
  billingDate: string;
  dueDate: string;
  status: string;
  paymentDate?: string;
  transactionId?: string;
}

export default function BillingCreditPage() {
  const [billings, setBillings] = useState<CreditBilling[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [formData, setFormData] = useState<Partial<CreditBilling>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchBillings();
  }, [filterMonth]);

  const fetchBillings = async () => {
    try {
      const mockBillings: CreditBilling[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        memberId: i + 1,
        memberCode: `MEM${String(i + 1).padStart(4, '0')}`,
        memberName: `会員${i + 1}`,
        cardBrand: ['Visa', 'Mastercard', 'JCB', 'American Express'][i % 4],
        last4Digits: String(i + 1).padStart(4, '0'),
        amount: 5000 + (i % 3) * 2000,
        billingDate: new Date(2024, 0, i + 1).toISOString(),
        dueDate: new Date(2024, 0, i + 15).toISOString(),
        status: (() => {
          if (i % 3 === 0) return 'PAID';
          if (i % 3 === 1) return 'PENDING';
          return 'FAILED';
        })(),
        paymentDate: (() => {
          if (i % 3 === 0) return new Date(2024, 0, i + 10).toISOString();
          return undefined;
        })(),
        transactionId: (() => {
          if (i % 3 === 0) return `TXN${String(i + 1).padStart(8, '0')}`;
          return undefined;
        })(),
      }));
      setBillings(mockBillings);
    } catch (error) {
      console.error('Failed to fetch billings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBillings = billings.filter((billing) => {
    const matchesSearch =
      billing.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      billing.memberCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || billing.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // ページネーション計算
  const totalPages = Math.ceil(filteredBillings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBillings = filteredBillings.slice(startIndex, endIndex);

  // ページ変更時に先頭にスクロール
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterMonth]);

  const totalAmount = billings.reduce((sum, b) => sum + b.amount, 0);
  const paidAmount = billings.filter((b) => b.status === 'PAID').reduce((sum, b) => sum + b.amount, 0);
  const pendingAmount = billings.filter((b) => b.status === 'PENDING').reduce((sum, b) => sum + b.amount, 0);

  const handleCreate = () => {
    setIsNew(true);
    setEditingId(null);
    setFormData({
      memberCode: '',
      memberName: '',
      cardBrand: 'Visa',
      last4Digits: '',
      amount: 5000,
      billingDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'PENDING',
      transactionId: '',
    });
  };

  const handleEdit = (billing: CreditBilling) => {
    setEditingId(billing.id);
    setIsNew(false);
    setFormData({
      ...billing,
      billingDate: new Date(billing.billingDate).toISOString().split('T')[0],
      dueDate: new Date(billing.dueDate).toISOString().split('T')[0],
      paymentDate: billing.paymentDate ? new Date(billing.paymentDate).toISOString().split('T')[0] : undefined,
    });
  };

  const handleSave = async () => {
    try {
      if (isNew) {
        const newBilling: CreditBilling = {
          id: Math.max(...billings.map((b) => b.id), 0) + 1,
          memberId: Math.max(...billings.map((b) => b.memberId), 0) + 1,
          memberCode: formData.memberCode || '',
          memberName: formData.memberName || '',
          cardBrand: formData.cardBrand || 'Visa',
          last4Digits: formData.last4Digits || '',
          amount: formData.amount || 0,
          billingDate: new Date(formData.billingDate || new Date()).toISOString(),
          dueDate: new Date(formData.dueDate || new Date()).toISOString(),
          status: formData.status || 'PENDING',
          paymentDate: formData.paymentDate ? new Date(formData.paymentDate).toISOString() : undefined,
          transactionId: formData.transactionId || undefined,
        };
        setBillings([...billings, newBilling]);
      } else if (editingId) {
        setBillings(
          billings.map((b) =>
            b.id === editingId
              ? {
                  ...b,
                  ...formData,
                  billingDate: new Date(formData.billingDate || b.billingDate).toISOString(),
                  dueDate: new Date(formData.dueDate || b.dueDate).toISOString(),
                  paymentDate: formData.paymentDate ? new Date(formData.paymentDate).toISOString() : undefined,
                }
              : b
          )
        );
      }
      setEditingId(null);
      setIsNew(false);
      setFormData({});
    } catch (error) {
      console.error('Failed to save billing:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (globalThis.confirm('この請求記録を削除しますか？')) {
      try {
        setBillings(billings.filter((b) => b.id !== id));
      } catch (error) {
        console.error('Failed to delete billing:', error);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsNew(false);
    setFormData({});
  };

  const updateFormData = (field: keyof CreditBilling, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 dark:from-gray-950 dark:via-violet-950 dark:to-purple-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-400 dark:bg-violet-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
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
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-2xl float relative overflow-hidden"
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
              <h1 className="text-3xl md:text-4xl font-black mb-2 gradient-text from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400">
                会費請求(クレジット)
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 font-light">
                クレジットカードによる会費請求管理
              </p>
            </div>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            className="group relative flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 overflow-hidden"
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
              <DollarSign className="w-8 h-8 text-violet-600" />
              <span className="text-3xl font-black text-violet-600 dark:text-violet-400">
                ¥{totalAmount.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">総請求額</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-black text-green-600 dark:text-green-400">
                ¥{paidAmount.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">決済完了</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-orange-600" />
              <span className="text-3xl font-black text-orange-600 dark:text-orange-400">
                ¥{pendingAmount.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">処理中</p>
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
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-violet-400 dark:text-violet-500 w-6 h-6 z-10" />
            <input
              type="text"
              placeholder="会員名、会員コードで検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-violet-500/50 text-gray-900 dark:text-white"
            />
          </div>
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="px-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-violet-500/50 text-gray-900 dark:text-white"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-violet-500/50 text-gray-900 dark:text-white"
          >
            <option value="all">全て</option>
            <option value="PAID">決済完了</option>
            <option value="PENDING">処理中</option>
            <option value="FAILED">失敗</option>
          </select>
        </motion.div>

        {/* Billing Table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-violet-200 border-t-violet-600 dark:border-violet-800 dark:border-t-violet-400"></div>
          </div>
        ) : (
          <div className="glass rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">会員コード</th>
                    <th className="px-6 py-4 text-left font-semibold">会員名</th>
                    <th className="px-6 py-4 text-left font-semibold">カード情報</th>
                    <th className="px-6 py-4 text-left font-semibold">請求額</th>
                    <th className="px-6 py-4 text-left font-semibold">請求日</th>
                    <th className="px-6 py-4 text-left font-semibold">支払期限</th>
                    <th className="px-6 py-4 text-left font-semibold">決済日</th>
                    <th className="px-6 py-4 text-left font-semibold">取引ID</th>
                    <th className="px-6 py-4 text-left font-semibold">ステータス</th>
                    <th className="px-6 py-4 text-left font-semibold">アクション</th>
                  </tr>
                </thead>
                <tbody>
                  {isNew && (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b-2 border-violet-500 bg-violet-50/50 dark:bg-violet-900/10"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={formData.memberCode || ''}
                          onChange={(e) => updateFormData('memberCode', e.target.value)}
                          placeholder="MEM0001"
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={formData.memberName || ''}
                          onChange={(e) => updateFormData('memberName', e.target.value)}
                          placeholder="会員名"
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={formData.cardBrand || 'Visa'}
                            onChange={(e) => updateFormData('cardBrand', e.target.value)}
                            className="px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
                          >
                            <option value="Visa">Visa</option>
                            <option value="Mastercard">Mastercard</option>
                            <option value="JCB">JCB</option>
                            <option value="American Express">American Express</option>
                          </select>
                          <input
                            type="text"
                            value={formData.last4Digits || ''}
                            onChange={(e) => updateFormData('last4Digits', e.target.value)}
                            placeholder="0000"
                            maxLength={4}
                            className="w-20 px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={formData.amount || 0}
                          onChange={(e) => updateFormData('amount', Number(e.target.value))}
                          placeholder="5000"
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="date"
                          value={formData.billingDate || ''}
                          onChange={(e) => updateFormData('billingDate', e.target.value)}
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="date"
                          value={formData.dueDate || ''}
                          onChange={(e) => updateFormData('dueDate', e.target.value)}
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="date"
                          value={formData.paymentDate || ''}
                          onChange={(e) => updateFormData('paymentDate', e.target.value)}
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={formData.transactionId || ''}
                          onChange={(e) => updateFormData('transactionId', e.target.value)}
                          placeholder="取引ID"
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={formData.status || 'PENDING'}
                          onChange={(e) => updateFormData('status', e.target.value)}
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
                        >
                          <option value="PENDING">処理中</option>
                          <option value="PAID">決済完了</option>
                          <option value="FAILED">失敗</option>
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
                  {paginatedBillings.map((billing, index) => (
                    <motion.tr
                      key={billing.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        editingId === billing.id ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      {editingId === billing.id ? (
                        <>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={formData.memberCode || ''}
                              onChange={(e) => updateFormData('memberCode', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={formData.memberName || ''}
                              onChange={(e) => updateFormData('memberName', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <select
                                value={formData.cardBrand || 'Visa'}
                                onChange={(e) => updateFormData('cardBrand', e.target.value)}
                                className="px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
                              >
                                <option value="Visa">Visa</option>
                                <option value="Mastercard">Mastercard</option>
                                <option value="JCB">JCB</option>
                                <option value="American Express">American Express</option>
                              </select>
                              <input
                                type="text"
                                value={formData.last4Digits || ''}
                                onChange={(e) => updateFormData('last4Digits', e.target.value)}
                                maxLength={4}
                                className="w-20 px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              value={formData.amount || 0}
                              onChange={(e) => updateFormData('amount', Number(e.target.value))}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="date"
                              value={formData.billingDate || ''}
                              onChange={(e) => updateFormData('billingDate', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="date"
                              value={formData.dueDate || ''}
                              onChange={(e) => updateFormData('dueDate', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="date"
                              value={formData.paymentDate || ''}
                              onChange={(e) => updateFormData('paymentDate', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={formData.transactionId || ''}
                              onChange={(e) => updateFormData('transactionId', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={formData.status || 'PENDING'}
                              onChange={(e) => updateFormData('status', e.target.value)}
                              className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
                            >
                              <option value="PENDING">処理中</option>
                              <option value="PAID">決済完了</option>
                              <option value="FAILED">失敗</option>
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
                            {billing.memberCode}
                          </td>
                          <td className="px-6 py-4 text-gray-900 dark:text-white">
                            {billing.memberName}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-violet-500" />
                              <span className="text-gray-600 dark:text-gray-400 font-semibold">
                                {billing.cardBrand}
                              </span>
                              <span className="font-mono text-gray-600 dark:text-gray-400">
                                ****{billing.last4Digits}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                            ¥{billing.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                            {new Date(billing.billingDate).toLocaleDateString('ja-JP')}
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                            {new Date(billing.dueDate).toLocaleDateString('ja-JP')}
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                            {billing.paymentDate
                              ? new Date(billing.paymentDate).toLocaleDateString('ja-JP')
                              : '-'}
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                            {billing.transactionId || '-'}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 text-xs rounded-full font-bold ${
                                (() => {
                                  if (billing.status === 'PAID') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
                                  if (billing.status === 'PENDING') return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
                                  return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
                                })()
                              }`}
                            >
                              {(() => {
                                if (billing.status === 'PAID') return '決済完了';
                                if (billing.status === 'PENDING') return '処理中';
                                return '失敗';
                              })()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <motion.button
                                onClick={() => handleEdit(billing)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                onClick={() => handleDelete(billing.id)}
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
            {filteredBillings.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                請求記録が見つかりませんでした
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredBillings.length > 0 && (
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
                  className="px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
                >
                  <option value={5}>5件</option>
                  <option value={10}>10件</option>
                  <option value={20}>20件</option>
                  <option value={50}>50件</option>
                </select>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {startIndex + 1} - {Math.min(endIndex, filteredBillings.length)} / {filteredBillings.length}件
                </span>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 glass rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-violet-100 dark:hover:bg-violet-900/20 transition-colors"
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
                          ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg'
                          : 'glass text-gray-700 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-900/20'
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
                  className="p-2 glass rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-violet-100 dark:hover:bg-violet-900/20 transition-colors"
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

