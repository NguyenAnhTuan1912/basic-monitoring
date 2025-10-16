import { LoggerBuilder } from "src/utils/logger";

/**
 * Đây là lớp đối tượng dùng để tạo ra Swagger Schema. Có cấu trúc như sau:
 *
 * {
 *   type: string;
 *   items?: TSwaggerSchema;
 *   properties?: {
 *     [K: string]: TSwaggerSchema;
 *   };
 * }
 */

export class SwaggerSchema {
  public type: string = "string";
  public items?: SwaggerSchema;
  public properties?: Record<string, SwaggerSchema>;

  static ValidTypes = ["string", "number", "array", "object"];

  /**
   * Check if type is supported.
   *
   * @param type
   * @returns
   */
  static checkType(type: string) {
    return SwaggerSchema.ValidTypes.findIndex((t) => t === type) !== -1;
  }

  constructor(type?: string) {
    if (type) this.type = type;
  }

  /**
   * Set type for schema.
   *
   * @param type
   * @returns
   */
  setType(type: string) {
    if (!SwaggerSchema.checkType(type)) {
      const msg = `Type [${type}] is invalid. Supported type are ${SwaggerSchema.ValidTypes.join(
        ", ",
      )}`;

      LoggerBuilder.Logger.error(LoggerBuilder.buildNormalLog(msg));
      throw new Error(msg);
    }

    this.type = type;
    return this;
  }

  /**
   * Set items schema.
   *
   * @param items
   * @returns
   */
  setItems(items: SwaggerSchema) {
    this.items = items;
    return this;
  }

  /**
   * Add new properties.
   *
   * @param name
   * @param schema
   * @returns
   */
  addProperty(name: string, schema: SwaggerSchema) {
    if (!this.properties) {
      this.properties = {};
    }

    this.properties[name] = schema;

    return this;
  }
}
