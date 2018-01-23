import * as React from 'react';
import * as PropTypes from 'prop-types';

import { IModelProviderContext } from '../provider/ModelProvider';
import { IModel, IModelMeta, IModelManager } from 'rev-models';
import { ModelValidationResult } from 'rev-models/lib/validation/validationresult';
import { isSet } from 'rev-models/lib/utils';
import { UI_COMPONENTS } from '../config';

export interface IDetailViewProps {
    model: string;
    primaryKeyValue?: string;
    component?: React.ComponentType;
}

export type IModelLoadState = 'NONE' | 'LOADING' | 'SAVING' ;

export interface IModelContext<T extends IModel = IModel> {
    loadState: IModelLoadState;
    manager: IModelManager;
    model: T;
    modelMeta: IModelMeta<T>;
    validation: ModelValidationResult;
    dirty: boolean;
    setLoadState(state: IModelLoadState): void;
    setDirty(dirty: boolean): void;
    validate(): Promise<ModelValidationResult>;
    update(): void;
}

export interface IModelContextProp<T extends IModel = IModel> {
    modelContext: IModelContext<T>;
}

export class DetailView extends React.Component<IDetailViewProps> {

    context: IModelProviderContext;
    static contextTypes = {
        modelManager: PropTypes.object
    };

    modelContext: IModelContext;

    constructor(props: IDetailViewProps, context: any) {
        super(props, context);

        if (!this.context.modelManager) {
            throw new Error('DetailView Error: must be nested inside a ModelProvider.');
        }
        const modelMeta = this.context.modelManager.getModelMeta(this.props.model);

        this.modelContext = {
            loadState: 'NONE',
            manager: this.context.modelManager,
            model: null,
            modelMeta,
            validation: null,
            dirty: false,
            setLoadState: (state) => this.setLoadState(state),
            setDirty: (dirty) => this.setDirty(dirty),
            validate: () => this.validate(),
            update: () => this.forceUpdate()
        };

        if (modelMeta.primaryKey && isSet(props.primaryKeyValue)) {
            this.loadModel();
        }
        else {
            this.setModel(new modelMeta.ctor());
        }
    }

    async loadModel() {
        this.modelContext.loadState = 'LOADING';
        const meta = this.modelContext.modelMeta;
        const result = await this.context.modelManager.read(
            meta.ctor,
            { [meta.primaryKey]: this.props.primaryKeyValue },
            { limit: 1 }
        );
        if (this.modelContext.loadState == 'LOADING') {
            this.modelContext.loadState = 'NONE';
            if (result.results.length == 1) {
                this.setModel(result.results[0]);
                this.forceUpdate();
            }
        }
    }

    setModel(model: IModel) {
        this.modelContext.model = model;
        this.modelContext.dirty = false;
    }

    setLoadState(state: IModelLoadState) {
        if (state != this.modelContext.loadState) {
            this.modelContext.loadState = state;
            this.forceUpdate();
        }
    }

    setDirty(dirty: boolean) {
        if (dirty != this.modelContext.dirty) {
            this.modelContext.dirty = dirty;
            this.forceUpdate();
        }
    }

    async validate() {
        const ctx = this.modelContext;
        ctx.validation = await this.context.modelManager.validate(ctx.model);
        this.forceUpdate();
        return ctx.validation;
    }

    static childContextTypes = {
        modelContext: PropTypes.object
    };

    getChildContext(): IModelContextProp {
        return {
            modelContext: this.modelContext
        };
    }

    render() {
        const Component = this.props.component || UI_COMPONENTS.views.DetailView;
        return <Component {...this.props} />;
    }
}
