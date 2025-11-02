import axios from 'axios';

// APIベースURLの設定
const getApiUrl = () => {
  // クライアントサイド
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  }
  // サーバーサイド
  return process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
};

export const apiClient = axios.create({
  baseURL: getApiUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター
apiClient.interceptors.request.use(
  (config) => {
    // 認証トークンなどの追加処理
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // エラーハンドリング
    if (error.response?.status === 401) {
      // 認証エラーの処理
      console.error('認証エラーが発生しました');
    }
    return Promise.reject(error);
  }
);

