'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CreditCard, Plus, Search, Download, QrCode, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MemberCard {
  id: number;
  memberId: number;
  memberCode: string;
  memberName: string;
  cardNumber: string;
  issueDate: string;
  expiryDate: string;
  status: string;
  qrCode: string;
}

export default function CardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<MemberCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      // モックデータ（実際のAPIエンドポイントに置き換え）
      const mockCards: MemberCard[] = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        memberId: i + 1,
        memberCode: `MEM${String(i + 1).padStart(4, '0')}`,
        memberName: `会員${i + 1}`,
        cardNumber: `CARD${String(i + 1).padStart(8, '0')}`,
        issueDate: new Date(2024, 0, i + 1).toISOString(),
        expiryDate: new Date(2025, 0, i + 1).toISOString(),
        status: i % 2 === 0 ? 'ACTIVE' : 'INACTIVE',
        qrCode: `QR${String(i + 1).padStart(6, '0')}`,
      }));
      setCards(mockCards);
    } catch (error) {
      console.error('Failed to fetch cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCards = cards.filter(
    (card) =>
      card.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.memberCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.cardNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIssueCard = () => {
    router.push('/cards/issue');
  };

  const handleDownloadQR = (card: MemberCard) => {
    // QRコードダウンロード処理
    console.log('Downloading QR code for:', card.cardNumber);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-950 dark:via-purple-950 dark:to-pink-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-400 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-400 dark:bg-pink-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
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
              <h1 className="text-4xl md:text-5xl font-black mb-3 gradient-text from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-indigo-400">
                会員証発行
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 font-light">
                会員証の発行・管理・QRコード生成
              </p>
            </div>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleIssueCard}
            className="group relative flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <Plus className="w-6 h-6 relative z-10" />
            <span className="font-bold text-lg relative z-10">新規発行</span>
          </motion.button>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-purple-400 dark:text-purple-500 w-6 h-6 z-10" />
            <input
              type="text"
              placeholder="会員名、会員コード、カード番号で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 glass rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
            />
          </div>
        </motion.div>

        {/* Cards Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 dark:border-purple-800 dark:border-t-purple-400"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.08,
                  type: 'spring',
                  stiffness: 100
                }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative glass rounded-3xl overflow-hidden cursor-pointer"
              >
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-[2px] -z-10 rounded-3xl">
                  <div className="h-full w-full glass rounded-3xl" />
                </div>

                <div className="p-6 relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 flex items-center justify-center shadow-xl float glow-effect-hover"
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                      >
                        <CreditCard className="w-8 h-8 text-white drop-shadow-lg" />
                      </motion.div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">カード番号</p>
                        <p className="font-mono font-black text-xl text-gray-900 dark:text-white tracking-wider">
                          {card.cardNumber}
                        </p>
                      </div>
                    </div>
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      className={`px-4 py-1.5 text-xs font-bold rounded-full shadow-lg ${
                        card.status === 'ACTIVE'
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {card.status === 'ACTIVE' ? '有効' : '無効'}
                    </motion.span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{card.memberName}</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">会員コード</p>
                      <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                        {card.memberCode}
                      </p>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">発行日</span>
                      <span className="text-gray-900 dark:text-white">
                        {new Date(card.issueDate).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">有効期限</span>
                      <span className="text-gray-900 dark:text-white">
                        {new Date(card.expiryDate).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                  </div>

                  <motion.div 
                    className="flex gap-3 pt-6 border-t border-gray-200/50 dark:border-gray-700/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.button
                      onClick={() => handleDownloadQR(card)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                    >
                      <QrCode className="w-5 h-5" />
                      <span>QRコード</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 glass rounded-xl hover:shadow-xl transition-all duration-300 font-semibold text-gray-700 dark:text-gray-300"
                    >
                      <Download className="w-5 h-5" />
                      <span>ダウンロード</span>
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredCards.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 glass rounded-3xl"
          >
            <p className="text-2xl text-gray-500 dark:text-gray-400 font-medium">会員証が見つかりませんでした</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

