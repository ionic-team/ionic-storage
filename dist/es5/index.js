"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var storage_1 = require("./storage");
exports.Storage = storage_1.Storage;
exports.StorageConfigToken = storage_1.StorageConfigToken;
var IonicStorageModule = (function () {
    function IonicStorageModule() {
    }
    IonicStorageModule.forRoot = function (storageConfig) {
        if (storageConfig === void 0) { storageConfig = null; }
        return {
            ngModule: IonicStorageModule,
            providers: [
                { provide: storage_1.StorageConfigToken, useValue: storageConfig },
                { provide: storage_1.Storage, useFactory: storage_1.provideStorage, deps: [storage_1.StorageConfigToken] },
            ]
        };
    };
    return IonicStorageModule;
}());
IonicStorageModule.decorators = [
    { type: core_1.NgModule, args: [{},] },
];
/** @nocollapse */
IonicStorageModule.ctorParameters = function () { return []; };
exports.IonicStorageModule = IonicStorageModule;
