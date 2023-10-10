export type StorageApi = {
  getItem(item: string): Promise<string | null> | string | null;
  setItem(item: string, value: string): Promise<void> | void;
  removeItem(item: string): Promise<void> | void;
};

function storage() {
  let unsecureStorage: StorageApi | null = null;
  let secureStorage: StorageApi | null = null;

  const setUnsecureStorage = (definedUnsecureStorage: StorageApi) =>
    (unsecureStorage = definedUnsecureStorage as StorageApi);
  const setSecureStorage = (definedSecureStorage: StorageApi) =>
    (secureStorage = definedSecureStorage as StorageApi);

  const getSecureStorage = (): StorageApi | null => secureStorage;
  const getUnsecureStorage = (): StorageApi | null => unsecureStorage;

  return {
    setSecureStorage,
    setUnsecureStorage,
    getSecureStorage,
    getUnsecureStorage,
  };
}

export default storage();
