export class AppUtilities {
  static capitalizeFirstLetter(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static isNullOrEmpty(value: any): boolean {
    return value === null || value === undefined || value === '';
  }
} 