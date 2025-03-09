export class Product {
  id: number;
  name: string;
  description: string;
  price: number;
  createdAt: Date;
  updatedAt: Date | null;
  isDeleted: boolean;
  isSynced: boolean;
  lastSyncedAt: Date | null;
  syncId: string;

  constructor(
    id: number = 0,
    name: string = '',
    description: string = '',
    price: number = 0,
    createdAt: Date = new Date(),
    updatedAt: Date | null = null,
    isDeleted: boolean = false,
    isSynced: boolean = false,
    lastSyncedAt: Date | null = null,
    syncId: string = ''
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isDeleted = isDeleted;
    this.isSynced = isSynced;
    this.lastSyncedAt = lastSyncedAt;
    this.syncId = syncId || this.generateSyncId();
  }

  private generateSyncId(): string {
    // Generate a GUID to match the SyncId from the C# class
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
