'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Settings, Store, Globe, Key, Bell, Save, Users, CreditCard } from 'lucide-react';

interface SettingsData {
  store: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  system: {
    timezone: string;
    currency: string;
    language: string;
    dateFormat: string;
  };
  integrations: {
    paymentGateway: string;
    emailService: string;
    smsService: string;
    analytics: boolean;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    newMember: boolean;
    lowStock: boolean;
    dailyReport: boolean;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    store: {
      name: '会員管理システム',
      address: '東京都渋谷区...',
      phone: '03-1234-5678',
      email: 'info@example.com',
      website: 'https://example.com',
    },
    system: {
      timezone: 'Asia/Tokyo',
      currency: 'JPY',
      language: 'ja',
      dateFormat: 'YYYY-MM-DD',
    },
    integrations: {
      paymentGateway: 'stripe',
      emailService: 'sendgrid',
      smsService: 'twilio',
      analytics: true,
    },
    notifications: {
      email: true,
      sms: false,
      push: true,
      newMember: true,
      lowStock: true,
      dailyReport: true,
    },
  });

  const [activeTab, setActiveTab] = useState<'store' | 'system' | 'integrations' | 'notifications'>(
    'store'
  );

  const handleSave = () => {
    console.log('Settings saved:', settings);
    // 実際のAPI呼び出しをここに追加
  };

  const updateSettings = (section: keyof SettingsData, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-gray-950 dark:via-slate-950 dark:to-zinc-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gray-400 dark:bg-gray-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-slate-400 dark:bg-slate-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
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
                <h1 className="text-4xl md:text-5xl font-black mb-3 gradient-text from-gray-600 via-slate-600 to-zinc-600 dark:from-gray-400 dark:via-slate-400 dark:to-zinc-400">
                  設定管理
                </h1>
                <p className="text-xl text-gray-700 dark:text-gray-300 font-light">
                  店舗設定・システム設定・外部連携
                </p>
              </div>
            </div>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="group relative flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gray-600 via-slate-600 to-zinc-600 text-white rounded-2xl shadow-2xl hover:shadow-gray-500/50 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <Save className="w-6 h-6 relative z-10" />
              <span className="font-bold text-lg relative z-10">保存</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {[
            { id: 'store', label: '店舗設定', icon: Store },
            { id: 'system', label: 'システム設定', icon: Settings },
            { id: 'integrations', label: '外部連携', icon: Globe },
            { id: 'notifications', label: '通知設定', icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
        >
          {activeTab === 'store' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Store className="w-6 h-6" />
                店舗情報
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    店舗名
                  </label>
                  <input
                    type="text"
                    value={settings.store.name}
                    onChange={(e) => updateSettings('store', 'name', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    電話番号
                  </label>
                  <input
                    type="text"
                    value={settings.store.phone}
                    onChange={(e) => updateSettings('store', 'phone', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    住所
                  </label>
                  <input
                    type="text"
                    value={settings.store.address}
                    onChange={(e) => updateSettings('store', 'address', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    value={settings.store.email}
                    onChange={(e) => updateSettings('store', 'email', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    ウェブサイト
                  </label>
                  <input
                    type="url"
                    value={settings.store.website}
                    onChange={(e) => updateSettings('store', 'website', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Settings className="w-6 h-6" />
                システム設定
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    タイムゾーン
                  </label>
                  <select
                    value={settings.system.timezone}
                    onChange={(e) => updateSettings('system', 'timezone', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:text-white"
                  >
                    <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    通貨
                  </label>
                  <select
                    value={settings.system.currency}
                    onChange={(e) => updateSettings('system', 'currency', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:text-white"
                  >
                    <option value="JPY">JPY (¥)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    言語
                  </label>
                  <select
                    value={settings.system.language}
                    onChange={(e) => updateSettings('system', 'language', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:text-white"
                  >
                    <option value="ja">日本語</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    日付形式
                  </label>
                  <select
                    value={settings.system.dateFormat}
                    onChange={(e) => updateSettings('system', 'dateFormat', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:text-white"
                  >
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Globe className="w-6 h-6" />
                外部連携
              </h2>
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        決済ゲートウェイ
                      </span>
                    </div>
                    <select
                      value={settings.integrations.paymentGateway}
                      onChange={(e) =>
                        updateSettings('integrations', 'paymentGateway', e.target.value)
                      }
                      className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:text-white"
                    >
                      <option value="stripe">Stripe</option>
                      <option value="paypal">PayPal</option>
                      <option value="square">Square</option>
                    </select>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Key className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        メールサービス
                      </span>
                    </div>
                    <select
                      value={settings.integrations.emailService}
                      onChange={(e) =>
                        updateSettings('integrations', 'emailService', e.target.value)
                      }
                      className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:text-white"
                    >
                      <option value="sendgrid">SendGrid</option>
                      <option value="mailchimp">Mailchimp</option>
                      <option value="ses">AWS SES</option>
                    </select>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        アナリティクス
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.integrations.analytics}
                        onChange={(e) =>
                          updateSettings('integrations', 'analytics', e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Bell className="w-6 h-6" />
                通知設定
              </h2>
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'メール通知' },
                  { key: 'sms', label: 'SMS通知' },
                  { key: 'push', label: 'プッシュ通知' },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {item.label}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications[item.key as keyof typeof settings.notifications] as boolean}
                        onChange={(e) =>
                          updateSettings('notifications', item.key, e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-600"></div>
                    </label>
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="font-semibold text-gray-900 dark:text-white mb-4">
                    通知イベント
                  </p>
                  <div className="space-y-3">
                    {[
                      { key: 'newMember', label: '新規会員登録時' },
                      { key: 'lowStock', label: '在庫不足時' },
                      { key: 'dailyReport', label: '日次レポート' },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications[item.key as keyof typeof settings.notifications] as boolean}
                            onChange={(e) =>
                              updateSettings('notifications', item.key, e.target.checked)
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

