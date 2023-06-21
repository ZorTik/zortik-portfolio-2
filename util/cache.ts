export type Cached<T> = {
    value: T, cachedAt: number,
}

class Cache {
    readonly data: { [key: string]: Cached<any> } = {};
    lastCleanup: number = 0;

    constructor(public readonly cacheTimeout: number) {
    }

    async get<T>(options: any, orFetch: () => Promise<T>): Promise<Cached<T>> {
        return this.getIfPresent(options) ?? this.set(options, await orFetch());
    }

    getIfPresent<T>(options: any, { remove }: { remove?: boolean } = {}): Cached<T> | undefined {
        const cached = this.data[JSON.stringify(options)];
        if (!cached) return undefined;
        const isInvalid = (cached: Cached<any>) => Date.now() - cached.cachedAt > this.cacheTimeout;
        const invalid = isInvalid(cached);
        if (invalid || remove) {
            delete this.data[JSON.stringify(options)];
            if (invalid) return undefined;
        }
        const now = new Date(Date.now()).getTime();
        if (now - this.lastCleanup > 10000) {
            this.remove((_, value) => isInvalid(value));
            this.lastCleanup = now;
        }
        return cached;
    }

    set<T>(options: any, value: T): Cached<T> {
        return this.data[JSON.stringify(options)] = { cachedAt: Date.now(), value: value, }
    }

    remove(pred: (key: string, value: Cached<any>) => boolean) {
        for (const key in this.data) {
            if (pred(key, this.data[key])) delete this.data[key];
        }
    }
}

function createCache(id: string, cacheTimeout: number = 30000) {
    const cacheGlobal = global as unknown as {
        __zcaches?: { [id: string]: Cache },
    }
    if (process.env.NODE_ENV === 'production') return new Cache(cacheTimeout);

    if (!cacheGlobal.__zcaches) cacheGlobal.__zcaches = {};
    if (!cacheGlobal.__zcaches[id]) cacheGlobal.__zcaches[id] = new Cache(cacheTimeout);
    return cacheGlobal.__zcaches[id];
}

export default createCache;
