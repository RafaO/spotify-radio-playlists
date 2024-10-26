import { ICache } from "../ICache";

export class CloudflareKVCache implements ICache {
    private kv: KVNamespace;

    constructor(kv: KVNamespace) {
        this.kv = kv;
    }

    async get(key: string): Promise<string | null> {
        return await this.kv.get(key);
    }

    async put(key: string, value: string): Promise<void> {
        await this.kv.put(key, value);
    }

    async list(): Promise<{ name: string }[]> {
        const kvKeys = (await this.kv.list()).keys;
        return kvKeys.map(key => ({ name: key.name }));
    }

    async delete(key: string): Promise<void> {
        await this.kv.delete(key);
    }
}
