import redis from './redis';

const RATE_LIMIT = {
  MAX_REQUESTS: 100,
  WINDOW_SIZE: 60,  // seconds
};

const getRateLimitKey = (ip: string, path: string) => `ratelimit:${ip}:${path}`;

export async function checkRateLimit(ip: string, path: string) {
  const key = getRateLimitKey(ip, path);

  try {
    const current = await redis.get(key);
    const count = current ? parseInt(current) : 0;

    if (count >= RATE_LIMIT.MAX_REQUESTS) {
      return { allowed: false };
    }

    await redis.multi()
      .incr(key)
      .expire(key, RATE_LIMIT.WINDOW_SIZE)
      .exec();

    return { allowed: true };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Allow requests if Redis fails
    return { allowed: true };
  }
}
