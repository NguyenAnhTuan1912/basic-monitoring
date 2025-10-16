import { InternalContext } from "./InternalContext";

/**
 * Khởi tạo Internal Context cho hàm hoặc các module trong core.
 *
 *@returns
 */
export function initializeInternalContext(): InternalContext {
  return new InternalContext();
}

export * from "./InternalContext";
