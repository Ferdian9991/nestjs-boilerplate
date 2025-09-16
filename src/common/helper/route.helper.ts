import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';

type RouteHelperType =
  | DynamicModule
  | Type<any>
  | Promise<DynamicModule>
  | ForwardReference<any>;

/**
 * Route helper class
 * @class Route
 */
export default class RouteHelper {
  public path: string;

  /**
   * Constructor
   * @param {string} path
   */
  constructor(path: string) {
    this.path = path;
  }

  /**
   * Register modules
   * @param {RouteHelperType[]} modules
   * @returns {DynamicModule[]}
   */
  public register(...modules: RouteHelperType[]): RouteHelperType[] {
    const registerModules = RouterModule.register(
      modules.map((module) => {
        return {
          path: this.path,
          module,
        };
      }) as Routes,
    );

    return [...modules, registerModules];
  }
}
