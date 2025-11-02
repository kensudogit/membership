'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Plus, Search, Package, TrendingUp, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  status: string;
}

interface Sale {
  id: number;
  saleDate: string;
  memberCode: string;
  memberName: string;
  products: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  paymentMethod: string;
  status: string;
}

export default function SalesPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'sales'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // モックデータ
      const mockProducts: Product[] = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        name: ['プロテイン', 'ウェア', 'タオル', 'ボトル', 'サプリメント'][i % 5],
        category: ['食品', 'ウェア', 'アクセサリー', 'ドリンク', 'サプリメント'][i % 5],
        price: Math.floor(Math.random() * 10000) + 500,
        stock: Math.floor(Math.random() * 100),
        unit: '個',
        status: i % 3 === 0 ? 'IN_STOCK' : 'LOW_STOCK',
      }));

      const mockSales: Sale[] = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        saleDate: new Date(2024, 0, i + 1, 0, 0, 0).toISOString(),
        memberCode: `MEM${String(i + 1).padStart(4, '0')}`,
        memberName: `会員${i + 1}`,
        products: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
          id: j + 1,
          name: ['プロテイン', 'ウェア', 'タオル'][j % 3],
          quantity: Math.floor(Math.random() * 5) + 1,
          price: Math.floor(Math.random() * 5000) + 1000,
        })),
        totalAmount: 0,
        paymentMethod: ['CASH', 'CARD', 'CREDIT'][i % 3],
        status: 'COMPLETED',
      }));

      for (const sale of mockSales) {
        sale.totalAmount = sale.products.reduce((sum, p) => sum + p.price * p.quantity, 0);
      }

      setProducts(mockProducts);
      setSales(mockSales);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredSales = sales.filter((sale) =>
    sale.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.memberCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalProducts = products.reduce((sum, product) => sum + product.stock, 0);
  const lowStockProducts = products.filter((p) => p.stock < 10).length;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 dark:from-gray-950 dark:via-orange-950 dark:to-red-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-400 dark:bg-orange-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-400 dark:bg-red-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex items-center gap-4"
          >
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
              <h1 className="text-4xl md:text-5xl font-black mb-3 gradient-text from-orange-600 via-red-600 to-amber-600 dark:from-orange-400 dark:via-red-400 dark:to-amber-400">
                販売管理
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 font-light">
                商品管理・販売履歴・在庫管理
              </p>
            </div>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/sales/new')}
            className="group relative flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 text-white rounded-2xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <Plus className="w-6 h-6 relative z-10" />
            <span className="font-bold text-lg relative z-10">新規販売</span>
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-orange-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ¥{totalSales.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">総売上</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Package className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalProducts}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">総在庫数</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-red-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {lowStockProducts}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">在庫不足商品</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'products'
                ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-600 dark:border-orange-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            商品管理
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'sales'
                ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-600 dark:border-orange-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            販売履歴
          </button>
        </div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 flex gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={
                activeTab === 'products'
                  ? '商品名、カテゴリーで検索...'
                  : '会員名、会員コードで検索...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white"
            />
          </div>
          {activeTab === 'products' && (
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white"
            >
              <option value="all">全カテゴリー</option>
              {Array.from(new Set(products.map((p) => p.category))).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )}
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'products' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">商品名</th>
                        <th className="px-6 py-4 text-left font-semibold">カテゴリー</th>
                        <th className="px-6 py-4 text-left font-semibold">価格</th>
                        <th className="px-6 py-4 text-left font-semibold">在庫</th>
                        <th className="px-6 py-4 text-left font-semibold">ステータス</th>
                        <th className="px-6 py-4 text-left font-semibold">アクション</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product, index) => (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                            {product.name}
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 text-gray-900 dark:text-white">
                            ¥{product.price.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-gray-900 dark:text-white">
                            {product.stock} {product.unit}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 text-xs rounded-full ${
                                product.status === 'IN_STOCK'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}
                            >
                              {product.status === 'IN_STOCK' ? '在庫あり' : '在庫不足'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium">
                              編集
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'sales' && (
              <div className="space-y-4">
                {filteredSales.map((sale, index) => (
                  <motion.div
                    key={sale.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(sale.saleDate).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white mt-1">
                          {sale.memberName} ({sale.memberCode})
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          ¥{sale.totalAmount.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {(() => {
                            if (sale.paymentMethod === 'CASH') return '現金';
                            if (sale.paymentMethod === 'CARD') return 'カード';
                            return 'クレジット';
                          })()}
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        購入商品:
                      </p>
                      <div className="space-y-2">
                        {sale.products.map((product, idx) => (
                          <div
                            key={`${sale.id}-${product.id}-${idx}`}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-gray-600 dark:text-gray-400">
                              {product.name} × {product.quantity}
                            </span>
                            <span className="text-gray-900 dark:text-white font-semibold">
                              ¥{(product.price * product.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {!loading &&
          ((activeTab === 'products' && filteredProducts.length === 0) ||
            (activeTab === 'sales' && filteredSales.length === 0)) && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              {activeTab === 'products' ? '商品が見つかりませんでした' : '販売履歴が見つかりませんでした'}
            </div>
          )}
      </div>
    </div>
  );
}

