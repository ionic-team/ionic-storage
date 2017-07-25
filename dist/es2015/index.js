import { NgModule } from '@angular/core';
import { provideStorage, Storage, StorageConfigToken } from './storage';
export { StorageConfigToken, Storage };
var IonicStorageModule = (function () {
    function IonicStorageModule() {
    }
    IonicStorageModule.forRoot = function (storageConfig) {
        if (storageConfig === void 0) { storageConfig = null; }
        return {
            ngModule: IonicStorageModule,
            providers: [
                { provide: StorageConfigToken, useValue: storageConfig },
                { provide: Storage, useFactory: provideStorage, deps: [StorageConfigToken] },
            ]
        };
    };
    return IonicStorageModule;
}());
export { IonicStorageModule };
IonicStorageModule.decorators = [
    { type: NgModule, args: [{},] },
];
/** @nocollapse */
IonicStorageModule.ctorParameters = function () { return []; };
