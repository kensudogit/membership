'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Plus, Search, Clock, User, MapPin, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Lesson {
  id: number;
  title: string;
  instructor: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  booked: number;
  status: string;
  members: Array<{
    id: number;
    name: string;
    memberCode: string;
  }>;
}

export default function LessonsPage() {
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      // モックデータ（実際のAPIエンドポイントに置き換え）
      const mockLessons: Lesson[] = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        title: ['ヨガ', 'ピラティス', '筋トレ', 'ダンス', 'ストレッチ'][i % 5],
        instructor: `インストラクター${String.fromCodePoint(65 + (i % 5))}`,
        date: new Date(2024, 0, i + 1, 0, 0, 0).toISOString(),
        startTime: `${10 + (i % 8)}:00`,
        endTime: `${11 + (i % 8)}:00`,
        location: ['スタジオA', 'スタジオB', 'スタジオC'][i % 3],
        capacity: 20,
        booked: Math.floor(Math.random() * 20),
        status: i < 8 ? 'UPCOMING' : 'COMPLETED',
        members: Array.from({ length: Math.floor(Math.random() * 5) }, (_, j) => ({
          id: j + 1,
          name: `会員${j + 1}`,
          memberCode: `MEM${String(j + 1).padStart(4, '0')}`,
        })),
      }));
      setLessons(mockLessons);
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || lesson.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateLesson = () => {
    router.push('/lessons/new');
  };

  const handleBookLesson = (lessonId: number) => {
    console.log('Booking lesson:', lessonId);
  };

  const handleCancelBooking = (lessonId: number, memberId: number) => {
    console.log('Canceling booking:', lessonId, memberId);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-50 dark:from-gray-950 dark:via-green-950 dark:to-emerald-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-400 dark:bg-green-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-400 dark:bg-emerald-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
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
              <h1 className="text-4xl md:text-5xl font-black mb-3 gradient-text from-green-600 via-emerald-600 to-cyan-600 dark:from-green-400 dark:via-emerald-400 dark:to-cyan-400">
                レッスン予約
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 font-light">
                レッスンスケジュール管理・予約・キャンセル
              </p>
            </div>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateLesson}
            className="group relative flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 via-emerald-600 to-cyan-600 text-white rounded-2xl shadow-2xl hover:shadow-green-500/50 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <Plus className="w-6 h-6 relative z-10" />
            <span className="font-bold text-lg relative z-10">新規作成</span>
          </motion.button>
        </div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 flex gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="レッスン名、インストラクター、場所で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
          >
            <option value="all">全て</option>
            <option value="UPCOMING">予定</option>
            <option value="COMPLETED">完了</option>
          </select>
        </motion.div>

        {/* Lessons List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {lesson.title}
                        </h3>
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${
                            lesson.status === 'UPCOMING'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          }`}
                        >
                          {lesson.status === 'UPCOMING' ? '予定' : '完了'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{lesson.instructor}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{lesson.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        {new Date(lesson.date).toLocaleDateString('ja-JP', {
                          month: 'long',
                          day: 'numeric',
                          weekday: 'short',
                        })}
                      </p>
                      <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold">
                          {lesson.startTime} - {lesson.endTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="text-gray-500 dark:text-gray-400">予約状況: </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {lesson.booked}/{lesson.capacity}
                        </span>
                      </div>
                      <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                          style={{ width: `${(lesson.booked / lesson.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                    {lesson.status === 'UPCOMING' && (
                      <button
                        onClick={() => handleBookLesson(lesson.id)}
                        disabled={lesson.booked >= lesson.capacity}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        予約する
                      </button>
                    )}
                  </div>

                  {lesson.members.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        予約者一覧 ({lesson.members.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {lesson.members.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {member.name}
                            </span>
                            <button
                              onClick={() => handleCancelBooking(lesson.id, member.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredLessons.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            レッスンが見つかりませんでした
          </div>
        )}
      </div>
    </div>
  );
}

