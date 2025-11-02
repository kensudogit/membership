'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Globe, User, Mail, Phone, CreditCard, Calendar, FileText, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';

interface EnrollmentForm {
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  postalCode: string;
  plan: string;
  paymentMethod: string;
  emergencyContact: string;
  emergencyPhone: string;
  agreeToTerms: boolean;
}

export default function WebEnrollmentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<EnrollmentForm>({
    firstName: '',
    lastName: '',
    firstNameKana: '',
    lastNameKana: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    postalCode: '',
    plan: '',
    paymentMethod: '',
    emergencyContact: '',
    emergencyPhone: '',
    agreeToTerms: false,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 1, title: '基本情報', icon: User },
    { id: 2, title: '連絡先', icon: Mail },
    { id: 3, title: 'プラン選択', icon: CreditCard },
    { id: 4, title: '確認', icon: FileText },
  ];

  const plans = [
    { id: 'basic', name: 'ベーシック', price: 5000, features: ['基本施設利用', 'グループレッスン', 'オンラインサポート'] },
    { id: 'premium', name: 'プレミアム', price: 8000, features: ['全施設利用', 'プライベートレッスン', '優先予約', '栄養相談'] },
    { id: 'vip', name: 'VIP', price: 15000, features: ['全施設利用', '無制限レッスン', '専属トレーナー', '24時間サポート', 'パーソナルプログラム'] },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API呼び出し
      await apiClient.post('/api/members/enroll', formData);
      router.push('/web-enrollment/success');
    } catch (error) {
      console.error('Enrollment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof EnrollmentForm, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-400 dark:bg-indigo-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl float relative overflow-hidden"
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
              <h1 className="text-3xl md:text-4xl font-black mb-2 gradient-text from-blue-600 via-indigo-600 to-cyan-600 dark:from-blue-400 dark:via-indigo-400 dark:to-cyan-400">
                Web入会
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 font-light">
                オンラインで簡単に会員登録
              </p>
            </div>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <motion.div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-110'
                          : isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      <StepIcon className="w-6 h-6" />
                    </motion.div>
                    <span
                      className={`text-sm font-semibold ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${
                        isCompleted
                          ? 'bg-green-500'
                          : currentStep > step.id
                            ? 'bg-blue-500'
                            : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass rounded-3xl p-8 mb-6"
          >
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  基本情報
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      姓 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      className="w-full px-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      className="w-full px-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      姓（カナ） <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastNameKana}
                      onChange={(e) => updateFormData('lastNameKana', e.target.value)}
                      className="w-full px-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      名（カナ） <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstNameKana}
                      onChange={(e) => updateFormData('firstNameKana', e.target.value)}
                      className="w-full px-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      生年月日 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                      className="w-full px-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      性別 <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.gender}
                      onChange={(e) => updateFormData('gender', e.target.value)}
                      className="w-full px-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-gray-900 dark:text-white"
                    >
                      <option value="">選択してください</option>
                      <option value="male">男性</option>
                      <option value="female">女性</option>
                      <option value="other">その他</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  連絡先情報
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      メールアドレス <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="w-full px-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      電話番号 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      className="w-full px-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      郵便番号 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => updateFormData('postalCode', e.target.value)}
                      className="w-full px-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      住所 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => updateFormData('address', e.target.value)}
                      className="w-full px-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      緊急連絡先名
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContact}
                      onChange={(e) => updateFormData('emergencyContact', e.target.value)}
                      className="w-full px-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      緊急連絡先電話番号
                    </label>
                    <input
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => updateFormData('emergencyPhone', e.target.value)}
                      className="w-full px-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Plan Selection */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  プラン選択
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {plans.map((plan) => (
                    <motion.div
                      key={plan.id}
                      whileHover={{ scale: 1.05, y: -5 }}
                      onClick={() => updateFormData('plan', plan.id)}
                      className={`p-6 glass rounded-2xl cursor-pointer border-2 transition-all duration-300 ${
                        formData.plan === plan.id
                          ? 'border-blue-500 shadow-xl shadow-blue-500/50'
                          : 'border-transparent hover:border-blue-300'
                      }`}
                    >
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {plan.name}
                      </h3>
                      <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-4">
                        ¥{plan.price.toLocaleString()}
                        <span className="text-lg text-gray-500">/月</span>
                      </div>
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <span className="text-green-500">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    支払い方法 <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.paymentMethod}
                    onChange={(e) => updateFormData('paymentMethod', e.target.value)}
                    className="w-full px-4 py-3 glass rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-gray-900 dark:text-white"
                  >
                    <option value="">選択してください</option>
                    <option value="credit">クレジットカード</option>
                    <option value="bank">口座振替</option>
                  </select>
                </div>
                <div className="flex items-start gap-3 p-4 glass rounded-xl">
                  <input
                    type="checkbox"
                    required
                    checked={formData.agreeToTerms}
                    onChange={(e) => updateFormData('agreeToTerms', e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-300"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    利用規約およびプライバシーポリシーに同意します <span className="text-red-500">*</span>
                  </label>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  登録内容の確認
                </h2>
                <div className="space-y-4">
                  <div className="p-4 glass rounded-xl">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">基本情報</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {formData.lastName} {formData.firstName} ({formData.lastNameKana} {formData.firstNameKana})
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      生年月日: {formData.dateOfBirth} | 性別: {formData.gender === 'male' ? '男性' : formData.gender === 'female' ? '女性' : 'その他'}
                    </p>
                  </div>
                  <div className="p-4 glass rounded-xl">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">連絡先</h3>
                    <p className="text-gray-600 dark:text-gray-400">メール: {formData.email}</p>
                    <p className="text-gray-600 dark:text-gray-400">電話: {formData.phone}</p>
                    <p className="text-gray-600 dark:text-gray-400">住所: {formData.postalCode} {formData.address}</p>
                  </div>
                  <div className="p-4 glass rounded-xl">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">プラン・支払い</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      プラン: {plans.find((p) => p.id === formData.plan)?.name || '未選択'}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      支払い方法: {formData.paymentMethod === 'credit' ? 'クレジットカード' : formData.paymentMethod === 'bank' ? '口座振替' : '未選択'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4">
            <motion.button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-8 py-4 glass rounded-xl font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all"
              whileHover={{ scale: currentStep === 1 ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              戻る
            </motion.button>
            {currentStep < steps.length ? (
              <motion.button
                type="button"
                onClick={nextStep}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-2xl hover:shadow-blue-500/50 transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                次へ
              </motion.button>
            ) : (
              <motion.button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-2xl hover:shadow-blue-500/50 transition-all flex items-center gap-2 disabled:opacity-50"
                whileHover={{ scale: loading ? 1 : 1.05, y: loading ? 0 : -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    送信中...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    登録完了
                  </>
                )}
              </motion.button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

