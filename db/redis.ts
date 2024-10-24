import { Redis } from '@upstash/redis'

import dotenv from 'dotenv';

dotenv.config();

class RedisClient {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      url: process.env.REDIS_URL,
      token: process.env.REDIS_TOKEN,
    });
  }

  private getKey = (key: string) => `${process.env.APP_ENV || 'local'}:${key}`;

  // set expiration time to 1yr for production otherwise 1 day
  private expirationTime = process.env.APP_ENV === 'production' ? 365 * 24 * 60 * 60 : 24 * 60 * 60;

  async create(key: string, value: string) {
    return await this.redis.set(this.getKey(key), value, { ex: this.expirationTime });
  }

  async update(key: string, value: string) {
    return await this.create(key, value);
  }

  async get(key: string) {
    return await this.redis.get(this.getKey(key));
  }

  async delete(key: string) {
    return await this.redis.del(this.getKey(key));
  }
}

export default new RedisClient();