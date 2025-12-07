/**
 * API 请求缓存工具
 * 使用内存缓存，可配置过期时间
 */

class ApiCache {
  constructor() {
    this.cache = new Map()
    this.defaultTTL = 5 * 60 * 1000 // 默认5分钟
  }

  /**
   * 生成缓存键
   * @param {string} url - 请求URL
   * @param {object} params - 请求参数
   * @returns {string} 缓存键
   */
  generateKey(url, params = {}) {
    const paramStr = JSON.stringify(params)
    return `${url}:${paramStr}`
  }

  /**
   * 获取缓存
   * @param {string} key - 缓存键
   * @returns {any|null} 缓存数据，如果不存在或已过期则返回null
   */
  get(key) {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }
    
    // 检查是否过期
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }

  /**
   * 设置缓存
   * @param {string} key - 缓存键
   * @param {any} data - 要缓存的数据
   * @param {number} ttl - 过期时间（毫秒），默认5分钟
   */
  set(key, data, ttl = this.defaultTTL) {
    const expiresAt = Date.now() + ttl
    this.cache.set(key, {
      data,
      expiresAt
    })
  }

  /**
   * 删除缓存
   * @param {string} key - 缓存键
   */
  delete(key) {
    this.cache.delete(key)
  }

  /**
   * 清空所有缓存
   */
  clear() {
    this.cache.clear()
  }

  /**
   * 清理过期缓存
   */
  cleanExpired() {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * 获取缓存大小
   * @returns {number} 缓存项数量
   */
  size() {
    return this.cache.size
  }
}

// 创建单例
const apiCache = new ApiCache()

// 定期清理过期缓存（每10分钟清理一次）
setInterval(() => {
  apiCache.cleanExpired()
}, 10 * 60 * 1000)

export default apiCache

