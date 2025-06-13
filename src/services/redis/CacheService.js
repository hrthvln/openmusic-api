const redis = require('redis');
const config = require('../../utils/config');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      // Konfigurasi Redis sesuai permintaan reviewer
      socket: {
        host: config.redis.host, // Menggunakan nilai dari config.redis.host
      },
    });

    this._client.on('error', (error) => {
      console.error('Redis Client Error:', error);
    });

    // PENTING: Koneksi ini harus di-await saat inisialisasi di server.js
    // Constructor tidak bisa async, jadi kita panggil saja .connect()
    // dan pastikan Promise-nya di-await di server.js
    this._client.connect();
  }

  // --- Metode set, get, delete ---

  async set(key, value, expirationInSecond = 1800) { // Default 30 menit = 1800 detik
    // Pastikan klien sudah terhubung sebelum operasi.
    // this._client.connect() akan mengembalikan Promise yang bisa di-await di server.js
    if (!this._client.isOpen) {
      console.warn('Redis client is not connected for SET operation. Operation may fail or delay.');
      // throw new Error('Redis client not connected for SET operation'); // Bisa dilempar error jika mandatory
    }
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    // Pastikan klien sudah terhubung sebelum operasi
    if (!this._client.isOpen) {
      console.warn('Redis client is not connected for GET operation. Operation may fail or delay.');
      // throw new Error('Redis client not connected for GET operation');
    }
    const result = await this._client.get(key);
    // Redis get mengembalikan null jika key tidak ditemukan, kita lempar error sesuai kebutuhan
    if (result === null) {
        throw new Error('Cache tidak ditemukan');
    }
    return result;
  }

  async delete(key) {
    // Pastikan klien sudah terhubung sebelum operasi
    if (!this._client.isOpen) {
      console.warn('Redis client is not connected for DELETE operation. Operation may fail or delay.');
      // throw new Error('Redis client not connected for DELETE operation');
    }
    return this._client.del(key);
  }
}

module.exports = CacheService;
