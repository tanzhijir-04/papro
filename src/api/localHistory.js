const DB_NAME = "zhigeng-paper-local-runs";
const STORE_NAME = "runs";

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) {
      reject(new Error("当前浏览器无法使用 IndexedDB，本机记录不可用。"));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const store = request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
      store.createIndex("createdAt", "createdAt");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error("无法打开本机记录。请检查浏览器存储设置。"));
  });
}

async function runTransaction(mode, operation) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    let result;
    const transaction = db.transaction(STORE_NAME, mode);
    const request = operation(transaction.objectStore(STORE_NAME));
    request.onsuccess = () => { result = request.result; };
    transaction.oncomplete = () => { db.close(); resolve(result); };
    transaction.onerror = () => {
      db.close();
      reject(new Error("本机记录操作失败。请检查浏览器存储空间。"));
    };
  });
}

export function saveRun({ id, createdAt, providerHost, model, prompt, answer, usage }) {
  // Only these fields are persisted. The API key is never accepted by this function.
  return runTransaction("readwrite", (store) => store.put({
    id, createdAt, providerHost, model, prompt, answer, usage,
  }));
}

export async function listRuns() {
  const runs = await runTransaction("readonly", (store) => store.getAll());
  return runs.sort((a, b) => b.createdAt - a.createdAt);
}

export function deleteRun(id) {
  return runTransaction("readwrite", (store) => store.delete(id));
}

export function clearRuns() {
  return runTransaction("readwrite", (store) => store.clear());
}
