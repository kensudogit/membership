'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Tablet, User, Search, QrCode, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';

interface Member {
  id: number;
  memberCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
}

interface EnrollmentSession {
  id: number;
  memberId: number;
  memberCode: string;
  startTime: string;
  currentStep: number;
  status: string;
}

export default function TabletEnrollmentPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [activeSession, setActiveSession] = useState<EnrollmentSession | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const mockMembers: Member[] = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        memberCode: `MEM${String(i + 1).padStart(4, '0')}`,
        firstName: `名${i + 1}`,
        lastName: `姓${i + 1}`,
        email: `member${i + 1}@example.com`,
        phone: `090-${String(i + 1).padStart(4, '0')}-${String(i + 1).padStart(4, '0')}`,
        status: i % 2 === 0 ? 'ACTIVE' : 'PENDING',
      }));
      setMembers(mockMembers);
    } catch (error) {
      console.error('Failed to fetch members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEnrollment = (member: Member) => {
    const session: EnrollmentSession = {
      id: Date.now(),
      memberId: member.id,
      memberCode: member.memberCode,
      startTime: new Date().toISOString(),
      currentStep: 1,
      status: 'IN_PROGRESS',
    };
    setActiveSession(session);
  };

  const handleCompleteEnrollment = async () => {
    if (!activeSession) return;
    try {
      await apiClient.post(`/api/members/${activeSession.memberId}/enroll-tablet`, {
        sessionId: activeSession.id,
      });
      setActiveSession(null);
      fetchMembers();
    } catch (error) {
      console.error('Failed to complete enrollment:', error);
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.memberCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-cyan-950 dark:to-blue-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-400 dark:bg-cyan-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
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
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center shadow-2xl float relative overflow-hidden"
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
              <h1 className="text-3xl md:text-4xl font-black mb-2 gradient-text from-cyan-600 via-blue-600 to-indigo-600 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400">
                タブレット入会
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 font-light">
                店舗でのタブレット入会支援
              </p>
            </div>
          </div>
        </motion.div>

        {activeSession ? (
          /* Active Enrollment Session */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl p-8 mb-6"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  入会手続き中: {activeSession.memberCode}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  開始時刻: {new Date(activeSession.startTime).toLocaleString('ja-JP')}
                </p>
              </div>
              <motion.button
                onClick={() => setActiveSession(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 glass rounded-xl text-gray-700 dark:text-gray-300 font-semibold"
              >
                キャンセル
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { step: 1, title: '会員情報確認', icon: User },
                { step: 2, title: 'プラン選択', icon: Tablet },
                { step: 3, title: '完了', icon: CheckCircle },
              ].map((step) => (
                <div
                  key={step.step}
                  className={`p-6 rounded-2xl transition-all ${
                    activeSession.currentStep >= step.step
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                      : 'glass text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <step.icon className="w-6 h-6" />
                    <span className="font-bold">ステップ {step.step}</span>
                  </div>
                  <p className="text-sm">{step.title}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <motion.button
                onClick={handleCompleteEnrollment}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold shadow-2xl hover:shadow-cyan-500/50 transition-all"
              >
                <CheckCircle className="w-5 h-5 inline mr-2" />
                入会完了
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6"
            >
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-cyan-400 dark:text-cyan-500 w-6 h-6 z-10" />
                <input
                  type="text"
                  placeholder="会員名、会員コード、メールアドレスで検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 glass rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
                />
              </div>
            </motion.div>

            {/* Members List */}
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-cyan-200 border-t-cyan-600 dark:border-cyan-800 dark:border-t-cyan-400"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.08,
                      type: 'spring',
                      stiffness: 100,
                    }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="group relative glass rounded-3xl overflow-hidden cursor-pointer"
                  >
                    <div className="p-6 relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                            会員コード
                          </p>
                          <p className="font-mono font-black text-xl text-gray-900 dark:text-white tracking-wider">
                            {member.memberCode}
                          </p>
                        </div>
                        <motion.span
                          whileHover={{ scale: 1.1 }}
                          className={`px-4 py-1.5 text-xs font-bold rounded-full shadow-lg ${
                            member.status === 'ACTIVE'
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {member.status === 'ACTIVE' ? '有効' : '保留中'}
                        </motion.span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <User className="w-4 h-4" />
                          <span className="text-sm">
                            {member.lastName} {member.firstName}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">メール</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {member.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">電話番号</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {member.phone}
                          </p>
                        </div>
                      </div>

                      <motion.button
                        onClick={() => handleStartEnrollment(member)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                      >
                        入会手続きを開始
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && filteredMembers.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 glass rounded-3xl"
              >
                <p className="text-2xl text-gray-500 dark:text-gray-400 font-medium">
                  会員が見つかりませんでした
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

