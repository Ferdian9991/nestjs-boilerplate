/**
 * Config Helper
 * @class ConfigHelper
 */
export default class ConfigHelper {
  /**
   * Get environment variable with optional default value
   *
   * @param {string} key
   * @param {TReturn} defaultValue
   * @returns
   */
  static get<TReturn>(key: string, defaultValue?: TReturn): TReturn {
    return (process.env[key] || defaultValue) as TReturn;
  }
}
