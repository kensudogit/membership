'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Users, CreditCard, Calendar, ShoppingCart, BarChart3, Settings } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      icon: Users,
      title: '会員管理',
      description: '会員情報の登録・管理・検索',
      href: '/members',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: CreditCard,
      title: '会員証発行',
      description: '会員証の発行・管理・QRコード生成',
      href: '/cards',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Calendar,
      title: 'レッスン予約',
      description: 'レッスンスケジュール管理・予約・キャンセル',
      href: '/lessons',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: ShoppingCart,
      title: '販売管理',
      description: '商品管理・販売履歴・在庫管理',
      href: '/sales',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: BarChart3,
      title: 'データ分析',
      description: '会員分析・売上分析・利用状況分析',
      href: '/analytics',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Settings,
      title: '設定管理',
      description: '店舗設定・システム設定・外部連携',
      href: '/settings',
      color: 'from-gray-500 to-slate-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
            会員管理システム
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            現代的で包括的な会員管理ソリューション
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <div
                  onClick={() => router.push(feature.href)}
                  className="relative h-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            { label: '総会員数', value: '1,234', color: 'text-blue-600' },
            { label: '本日来場', value: '89', color: 'text-green-600' },
            { label: '今月売上', value: '¥12,345,678', color: 'text-purple-600' },
            { label: 'アクティブ予約', value: '56', color: 'text-orange-600' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {stat.label}
              </p>
              <p className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

