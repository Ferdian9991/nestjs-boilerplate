export interface ResponseTypes<T> {
  statusCode: number;
  message: string | ValidationErrorType[];
  data?: T;
}

export type ValidationErrorType = {
  index?: number | null;
  field: string;
  message: string;
};

/**
 * Response helper class
 * @class Response
 */
class ResponseHelper<TReturn> {
  private data: TReturn;
  private message: string;
  private statusCode?: number | undefined;

  /**
   * Constructor
   *
   * @param {string} message
   * @param {number} statusCode
   * @param {TReturn} data
   */
  constructor(
    message: string | object | any,
    statusCode?: number,
    data?: TReturn,
  ) {
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }

  /**
   * Get success response
   *
   * @returns {ResponseTypes<TReturn>}
   */
  public success(): ResponseTypes<TReturn> {
    return {
      statusCode: this.statusCode || 200,
      message: this.message,
      data: this.data,
    };
  }
}

export default ResponseHelper;
