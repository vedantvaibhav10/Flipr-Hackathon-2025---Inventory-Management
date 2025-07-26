import Dexie from 'dexie';

export const db = new Dexie('InvTrackDB');

// Version 1 is the original schema
db.version(1).stores({
    products: '&_id, name, sku, category',
    suppliers: '&_id, name',
    orders: '&_id, status, product, supplier',
    outbox: '++id, url, method, timestamp'
});

// Version 2 adds the new inventoryLogs table
db.version(2).stores({
    inventoryLogs: '&_id, product, user, actionType'
});
