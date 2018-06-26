import { StoreOptions, Store, Module } from 'vuex';
import { PluginFunction } from 'vue';

export function createMuseModel(options: StoreOptions): Store;

type PlainObject = {
  [key: string]: any
};

interface ModelOptions {
  namespace: string;
  state: PlainObject;
  getters?: any;
  [key: String]: any;
};

interface ModelModuleOptions {
  namespace: string;
  state: PlainObject;
  getters?: any;
  module: Module;
  [key: String]: any;
}

interface MethodsDecorator {
  (target: any, name: string, descriptor: PropertyDescriptor): any;
}

interface LoadingDecorator extends MethodsDecorator {
  (propName: string): (target: any, name: string, descriptor: PropertyDecorator) => any;
}

interface Mixin {
  state: PlainObject;
  getters?: any;
  [key: String]: any;
}

interface ModelDecorator {
  (namespace: string, mixins?: Mixin): (Class: any) => ModelModuleOptions;
}

export const loading: LoadingDecorator;
export const action: MethodsDecorator;
export const getter: MethodsDecorator;
export const model: ModelDecorator;

export function Model (options: ModelOptions): ModelModuleOptions;
export default interface MuseModel {
  version: string;
  install: PluginFunction;
  createMuseModel;
}
