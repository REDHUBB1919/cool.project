let redis: any = null;

if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
  const Redis = require('ioredis');
  redis = new Redis(process.env.REDIS_URL!);
} else if (process.env.NODE_ENV === 'development') {
  const Redis = require('ioredis');
  redis = new Redis(process.env.REDIS_URL!);
}

// Redis 연결 에러 처리
redis.on('error', (error) => {
  console.error('Redis 연결 에러:', error);
});

export default redis; 