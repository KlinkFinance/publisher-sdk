/**
 * Simple logger utility for SDK debugging
 */
export class Logger {
  private enabled: boolean;
  private prefix: string;

  constructor(enabled: boolean, prefix = "[Klink SDK]") {
    this.enabled = enabled;
    this.prefix = prefix;
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.enabled) {
      console.log(`${this.prefix} [DEBUG]`, message, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.enabled) {
      console.log(`${this.prefix} [INFO]`, message, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.enabled) {
      console.warn(`${this.prefix} [WARN]`, message, ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.enabled) {
      console.error(`${this.prefix} [ERROR]`, message, ...args);
    }
  }
}
