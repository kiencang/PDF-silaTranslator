import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface TranslatedDoc {
  id?: number;
  originalFileName: string;
  vietnameseTitle: string;
  mode: string;
  model?: string;
  timestamp: number;
  content: string;
  pdfHash?: string;
  originalFileBlob?: Blob;
  originalFileMimeType?: string;
  promptTokens?: number;
  candidatesTokens?: number;
}

interface TranslatorHistoryDB extends DBSchema {
  translations: {
    key: number;
    value: TranslatedDoc;
  };
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly dbName = 'SilaTranslatorDB';
  private readonly storeName = 'translations' as const;
  private dbPromise: Promise<IDBPDatabase<TranslatorHistoryDB>> | null = null;
  private isBrowser: boolean;

  constructor() {
    this.isBrowser = typeof window !== 'undefined' && typeof indexedDB !== 'undefined';
    if (this.isBrowser) {
      // Clean up legacy temporary image database if it exists from older versions
      try {
        indexedDB.deleteDatabase('sila-translator-db');
      } catch {
        // Ignore cleanup errors
      }
      this.initDB()?.catch(err => console.error('Error auto-initializing DB:', err));
    }
  }

  private initDB(): Promise<IDBPDatabase<TranslatorHistoryDB>> | null {
    if (!this.isBrowser) return null;
    if (!this.dbPromise) {
      const storeName = this.storeName;
      this.dbPromise = openDB<TranslatorHistoryDB>(this.dbName, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
          }
        },
      });
    }
    return this.dbPromise;
  }

  async saveTranslation(doc: TranslatedDoc): Promise<number | undefined> {
    const dbPromise = this.initDB();
    if (!dbPromise) return undefined;
    const db = await dbPromise;

    // Cleanup oldest items if we already have 10 items
    const all = await this.getAll();
    if (all.length >= 10) {
      const sorted = [...all].sort((a, b) => a.timestamp - b.timestamp);
      const toDeleteCount = all.length - 9;
      const toDelete = sorted.slice(0, toDeleteCount);
      for (const item of toDelete) {
        if (item.id !== undefined) {
          await this.delete(item.id);
        }
      }
    }

    try {
      return await db.add(this.storeName, doc);
    } catch (err) {
      console.warn('Lỗi khi lưu kèm file gốc, đang thử lưu lại không kèm file gốc:', err);
      if (doc.originalFileBlob) {
        const fallbackDoc = { ...doc };
        delete fallbackDoc.originalFileBlob;
        delete fallbackDoc.originalFileMimeType;
        return await db.add(this.storeName, fallbackDoc);
      } else {
        throw err;
      }
    }
  }

  async updateTranslationContent(id: number, content: string): Promise<void> {
    const dbPromise = this.initDB();
    if (!dbPromise) return;
    const db = await dbPromise;

    const tx = db.transaction(this.storeName, 'readwrite');
    const doc = await tx.store.get(id);
    if (doc) {
      doc.content = content;
      await tx.store.put(doc);
    }
    await tx.done;
  }

  async getAll(): Promise<TranslatedDoc[]> {
    const dbPromise = this.initDB();
    if (!dbPromise) return [];
    const db = await dbPromise;

    const results = await db.getAll(this.storeName);
    return results.sort((a, b) => b.timestamp - a.timestamp);
  }

  async delete(id: number): Promise<void> {
    const dbPromise = this.initDB();
    if (!dbPromise) return;
    const db = await dbPromise;

    await db.delete(this.storeName, id);
  }
}
