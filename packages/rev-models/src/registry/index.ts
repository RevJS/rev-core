
import { IModelMeta, initialiseMeta } from '../models/meta';
import { Model } from '../models/model';
import { checkIsModelConstructor } from '../models/utils';

export class ModelRegistry {

    _modelProto: { [modelName: string]: new() => any };
    _modelMeta: { [modelName: string]: IModelMeta };

    constructor() {
        this._modelProto = {};
        this._modelMeta = {};
    }

    // TODO: Support extending existing models

    isRegistered(modelName: string): boolean {
        return (modelName in this._modelProto);
    }

    register<T extends Model>(model: new(...args: any[]) => T, meta?: IModelMeta) {

        // Check model constructor
        checkIsModelConstructor(model);
        let modelName = model.name;
        if (this.isRegistered(modelName)) {
            throw new Error(`RegistryError: Model '${modelName}' already exists in the registry.`);
        }

        // Initialise model metadata
        meta = initialiseMeta(model, meta);

        // Add prototype and metadata to the registry
        this._modelProto[modelName] = model;
        this._modelMeta[modelName] = meta;
    }

    getModelNames(): string[] {
        return Object.keys(this._modelMeta);
    }

    getProto(modelName: string) {
        if (!this.isRegistered(modelName)) {
            throw new Error(`RegistryError: Model  '${modelName}' does not exist in the registry.`);
        }
        return this._modelProto[modelName];
    }

    getMeta(modelName: string) {
        if (!this.isRegistered(modelName)) {
            throw new Error(`RegistryError: Model  '${modelName}' does not exist in the registry.`);
        }
        return this._modelMeta[modelName];
    }

    clearRegistry() {
        this._modelProto = {};
        this._modelMeta = {};
    }
}

export const registry = new ModelRegistry();

export function register<T extends Model>(model: new(...args: any[]) => T, meta?: IModelMeta) {
    registry.register(model, meta);
}
