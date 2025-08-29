/**
 * Performance Utils - 性能优化工具
 * 提供各种性能优化功能
 */

class PerformanceUtils {
    constructor() {
        this.observers = new Map();
        this.debounceTimers = new Map();
        this.throttleTimers = new Map();
    }

    /**
     * 防抖函数
     * @param {Function} func 要防抖的函数
     * @param {number} wait 等待时间
     * @param {string} key 唯一标识
     * @returns {Function} 防抖后的函数
     */
    debounce(func, wait, key = 'default') {
        return (...args) => {
            clearTimeout(this.debounceTimers.get(key));
            this.debounceTimers.set(key, setTimeout(() => {
                func.apply(this, args);
                this.debounceTimers.delete(key);
            }, wait));
        };
    }

    /**
     * 节流函数
     * @param {Function} func 要节流的函数
     * @param {number} limit 时间限制
     * @param {string} key 唯一标识
     * @returns {Function} 节流后的函数
     */
    throttle(func, limit, key = 'default') {
        return (...args) => {
            if (!this.throttleTimers.has(key)) {
                func.apply(this, args);
                this.throttleTimers.set(key, setTimeout(() => {
                    this.throttleTimers.delete(key);
                }, limit));
            }
        };
    }

    /**
     * 懒加载图片
     * @param {string} selector 图片选择器
     */
    lazyLoadImages(selector = 'img[data-src]') {
        const images = document.querySelectorAll(selector);
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // 降级处理
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }

    /**
     * 预加载关键资源
     * @param {Array} resources 资源列表
     */
    preloadResources(resources = []) {
        resources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.url;
            link.as = resource.type || 'fetch';
            if (resource.crossOrigin) {
                link.crossOrigin = resource.crossOrigin;
            }
            document.head.appendChild(link);
        });
    }

    /**
     * 优化滚动性能
     * @param {Function} callback 滚动回调
     * @param {Object} options 选项
     */
    optimizeScroll(callback, options = {}) {
        const {
            throttle = 16, // 60fps
            passive = true,
            capture = false
        } = options;

        const throttledCallback = this.throttle(callback, throttle, 'scroll');
        
        window.addEventListener('scroll', throttledCallback, {
            passive,
            capture
        });

        return () => {
            window.removeEventListener('scroll', throttledCallback, {
                passive,
                capture
            });
        };
    }

    /**
     * 优化resize性能
     * @param {Function} callback resize回调
     * @param {Object} options 选项
     */
    optimizeResize(callback, options = {}) {
        const {
            debounce = 250,
            passive = true
        } = options;

        const debouncedCallback = this.debounce(callback, debounce, 'resize');
        
        window.addEventListener('resize', debouncedCallback, {
            passive
        });

        return () => {
            window.removeEventListener('resize', debouncedCallback, {
                passive
            });
        };
    }

    /**
     * 批量DOM操作优化
     * @param {Function} operations 操作函数
     */
    batchDOMOperations(operations) {
        // 使用 requestAnimationFrame 批量处理DOM操作
        requestAnimationFrame(() => {
            operations();
        });
    }

    /**
     * 虚拟滚动优化
     * @param {HTMLElement} container 容器元素
     * @param {Array} items 数据项
     * @param {Function} renderItem 渲染函数
     * @param {Object} options 选项
     */
    virtualScroll(container, items, renderItem, options = {}) {
        const {
            itemHeight = 50,
            buffer = 5
        } = options;

        let scrollTop = 0;
        const containerHeight = container.clientHeight;
        const visibleCount = Math.ceil(containerHeight / itemHeight);
        const totalHeight = items.length * itemHeight;

        const updateVisibleItems = () => {
            const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
            const endIndex = Math.min(items.length, Math.ceil((scrollTop + containerHeight) / itemHeight) + buffer);

            // 清空容器
            container.innerHTML = '';

            // 添加顶部占位
            const topSpacer = document.createElement('div');
            topSpacer.style.height = `${startIndex * itemHeight}px`;
            container.appendChild(topSpacer);

            // 渲染可见项
            for (let i = startIndex; i < endIndex; i++) {
                const itemElement = renderItem(items[i], i);
                itemElement.style.position = 'absolute';
                itemElement.style.top = `${i * itemHeight}px`;
                itemElement.style.height = `${itemHeight}px`;
                container.appendChild(itemElement);
            }

            // 添加底部占位
            const bottomSpacer = document.createElement('div');
            bottomSpacer.style.height = `${(items.length - endIndex) * itemHeight}px`;
            container.appendChild(bottomSpacer);
        };

        container.style.height = `${totalHeight}px`;
        container.style.position = 'relative';
        container.style.overflow = 'auto';

        container.addEventListener('scroll', this.throttle(() => {
            scrollTop = container.scrollTop;
            updateVisibleItems();
        }, 16, 'virtual-scroll'));

        // 初始渲染
        updateVisibleItems();
    }

    /**
     * 内存泄漏检测
     */
    detectMemoryLeaks() {
        if (performance.memory) {
            const memory = performance.memory;
            console.log('Memory Usage:', {
                used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
                total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
                limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
            });
        }
    }

    /**
     * 清理资源
     */
    cleanup() {
        // 清理所有定时器
        this.debounceTimers.forEach(timer => clearTimeout(timer));
        this.throttleTimers.forEach(timer => clearTimeout(timer));
        this.debounceTimers.clear();
        this.throttleTimers.clear();

        // 清理观察器
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }
}

// 导出工具类
window.PerformanceUtils = PerformanceUtils; 