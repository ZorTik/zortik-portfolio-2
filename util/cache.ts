export type Cached<T> = {
    value: T, cachedAt: number,
}

function createCache() {
    const cache = {
        data: {} as { [key: string]: Cached<any> },
        async get<T>(options: any, orFetch: () => Promise<T>): Promise<Cached<T>> {
            let cachedResult = cache.data[JSON.stringify(options)];
            if (!cachedResult || Date.now() - cachedResult.cachedAt > 1000 * 30) {
                cachedResult = cache.data[JSON.stringify(options)] = { cachedAt: Date.now(), value: await orFetch(), }
            }
            return cachedResult;
        },
        remove(pred: (key: string, value: Cached<any>) => boolean) {
            for (const key in cache.data) {
                if (pred(key, cache.data[key])) delete cache.data[key];
            }
        }
    }
    return cache;
}

export default createCache;
