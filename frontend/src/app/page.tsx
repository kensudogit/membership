'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Users, CreditCard, Calendar, ShoppingCart, BarChart3, Settings, Globe, Tablet, LogIn, Building2, Phone, Lock, Store, GraduationCap } from 'lucide-react';

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
    {
      icon: Globe,
      title: 'Web入会',
      description: 'オンラインで簡単に会員登録',
      href: '/web-enrollment',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      icon: Tablet,
      title: 'タブレット入会',
      description: '店舗でのタブレット入会支援',
      href: '/tablet-enrollment',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: LogIn,
      title: '来場管理',
      description: '会員の来場チェック・履歴管理',
      href: '/attendance',
      color: 'from-teal-500 to-green-500',
    },
    {
      icon: Building2,
      title: '会費請求(口座振替)',
      description: '口座振替による会費請求管理',
      href: '/billing-bank',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: CreditCard,
      title: '会費請求(クレジット)',
      description: 'クレジットカードによる会費請求管理',
      href: '/billing-credit',
      color: 'from-violet-500 to-purple-500',
    },
    {
      icon: Phone,
      title: '電話サポート',
      description: '電話での問い合わせ・サポート管理',
      href: '/phone-support',
      color: 'from-rose-500 to-pink-500',
    },
    {
      icon: Lock,
      title: '契約ロッカー管理',
      description: 'ロッカーの貸出・返却・契約管理',
      href: '/lockers',
      color: 'from-amber-500 to-yellow-500',
    },
    {
      icon: Store,
      title: '多店舗展開機能',
      description: '複数店舗の管理・店舗間データ連携',
      href: '/multi-store',
      color: 'from-lime-500 to-green-500',
    },
    {
      icon: GraduationCap,
      title: 'セミナー・シンポジウム運営管理',
      description: '定期的に開催されるセミナー・シンポジウムの運営管理',
      href: '/seminars',
      color: 'from-indigo-500 to-purple-500',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center gap-6"
          >
            <motion.div
              className="relative w-24 h-24 md:w-32 md:h-32"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/PC.png"
                alt="PC"
                width={128}
                height={128}
                className="object-contain"
              />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 gradient-text from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              会員管理システム
            </h1>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.03, 
                  y: -8,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                className="group perspective-1000"
              >
                <div
                  onClick={() => router.push(feature.href)}
                  className="relative h-full p-8 glass rounded-3xl cursor-pointer overflow-hidden transform transition-all duration-500 group-hover:scale-105"
                >
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 -left-full group-hover:left-full transition-all duration-1000 shimmer opacity-30" />
                  
                  {/* Animated Border */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-[2px] -z-10`}>
                    <div className="h-full w-full glass rounded-3xl" />
                  </div>

                  <div className="relative z-10">
                    <motion.div 
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-2xl glow-effect-hover float`}
                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-10 h-10 text-white drop-shadow-lg" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:gradient-text group-hover:from-indigo-600 group-hover:to-pink-600 transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                      {feature.description}
                    </p>
                    
                    {/* Arrow Indicator */}
                    <div className="mt-6 flex items-center text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="font-semibold">詳細を見る</span>
                      <motion.svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        initial={{ x: 0 }}
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </motion.svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            { label: '総会員数', value: '1,234', color: 'from-blue-500 to-cyan-500', icon: '👥' },
            { label: '本日来場', value: '89', color: 'from-green-500 to-emerald-500', icon: '🚪' },
            { label: '今月売上', value: '¥12.3M', color: 'from-purple-500 to-pink-500', icon: '💰' },
            { label: 'アクティブ予約', value: '56', color: 'from-orange-500 to-red-500', icon: '📅' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-6 glass rounded-2xl hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl opacity-70 group-hover:opacity-100 transition-opacity">{stat.icon}</span>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity blur-xl`} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                {stat.label}
              </p>
              <p className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

