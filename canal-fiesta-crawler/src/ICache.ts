export interface ICache {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
    list(): Promise<{ name: string }[]>;
    delete(key: string): Promise<void>;
}
