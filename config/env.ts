type modeBuild = 'development' | 'production';
type ssl = 'spdy' | 'http';

export const MODE_BUILD: modeBuild = 'development';
export const SSL: ssl = 'http';
export const HOST: string = '0.0.0.0';
export const PORT: number = 6069;
export const OPEN_IN_BROWSER: boolean = false;

// по умолчанию это лучше выносить в .env а не хранить как отдельный ts файл
