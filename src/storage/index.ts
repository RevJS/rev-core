import { IModelMeta } from '../models/meta';
import { ICreateOptions, IReadOptions, IUpdateOptions, IRemoveOptions } from '../models';
import { InMemoryStorage } from './inmemory';
import { ModelOperationResult } from '../models/operations';
import { IModel } from '../models/model';
import { IWhereQuery } from '../operators/operators';
export * from './inmemory';

export interface IStorage {
    create<T extends IModel>(model: T, meta: IModelMeta<T>, options?: ICreateOptions): Promise<ModelOperationResult<T>>;
    update<T extends IModel>(model: T, meta: IModelMeta<T>, where?: IWhereQuery, options?: IUpdateOptions): Promise<ModelOperationResult<T>>;
    read<T extends IModel>(model: new() => T, meta: IModelMeta<T>, where?: IWhereQuery, options?: IReadOptions): Promise<T[]>;
    remove<T extends IModel>(model: new() => T, meta: IModelMeta<T>, where?: IWhereQuery, options?: IRemoveOptions): Promise<ModelOperationResult<T>>;
}

let configuredStorage: {[storageName: string]: IStorage} = {
    default: new InMemoryStorage()
};

export function get(storageName: string) {
    return configuredStorage[storageName];
}

export function configure(storageName: string, storage: IStorage) {
    configuredStorage[storageName] = storage;
}
