let redis: any = null;

if (process.env.VERCEL_ENV !== 'production') {
  const Redis = require('ioredis');
  redis = new Redis(process.env.REDIS_URL!);
} else {
  console.warn('Redis is disabled in Vercel Production Environment');
}

// Redis 연결 에러 처리
redis.on('error', (error) => {
  console.error('Redis 연결 에러:', error);
});

export default redis; 