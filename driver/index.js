// Implement the driver here.
var ionicSecureStorageDriver = {
    _driver: 'ionicSecureStorage',
    _encryptionKey: null,
    _initStorage: async function(options) {
      throw new Error('Not available');
    },
    clear: function(callback) {
    },
    getItem: function(key, callback) {
    },
    iterate: function(iteratorCallback, successCallback) {
    },    
    key: function(n, callback) {
    },
    keys: function(callback) {
    },
    length: function(callback) {
    },
    removeItem: function(key, callback) {
    },
    setItem: function(key, value, callback) {
    },
    setEncryptionKey: function(key) {
      this._encryptionKey = key;
      console.log('Set encryption key');
    }
}

// Add the driver to localForage.
localforage.defineDriver(ionicSecureStorageDriver);