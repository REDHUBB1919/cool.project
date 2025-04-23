import Redis from 'ioredis';

// Redis 클라이언트 설정
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Redis 연결 에러 처리
redis.on('error', (error) => {
  console.error('Redis 연결 에러:', error);
});

export default redis; 