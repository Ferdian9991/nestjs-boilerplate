import * as bcrypt from 'bcrypt';

/**
 * Hash Helper using bcrypt
 * @class HashHelper
 */
export class HashHelper {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Hash a plain text
   *
   * @param {string} plainText
   * @returns {Promise<string>}
   */
  static async hash(plainText: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    return await bcrypt.hash(plainText, salt);
  }

  /**
   * Compare a plain text with a hash
   *
   * @param {string} plainText
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
  static async compare(plainText: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hash);
  }
}
