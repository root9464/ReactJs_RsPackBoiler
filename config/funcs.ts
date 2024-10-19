// Функция для вывода окрашенного текста в терминал
export function coloredLog(color: string, message: string): void {
  const colors: { [key: string]: string } = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m', // фиолетовый
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m',
  };

  // Проверка на существование цвета
  const colorCode = colors[color] || colors.reset;
  console.log(`${colorCode}${message}${colors.reset}`);
}
