import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import { defineConfig } from '@rspack/cli';
import { ProvidePlugin, rspack } from '@rspack/core';
import * as RefreshPlugin from '@rspack/plugin-react-refresh';
import { resolve } from 'path';
import { HOST, MODE_BUILD, OPEN_IN_BROWSER, PORT, SSL } from './config/env';
import { coloredLog } from './config/funcs';
//env.ts
const isDevelopment = MODE_BUILD === 'development';
const useSsl = Boolean(SSL);

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14'];

// Примеры использования
coloredLog('magenta', 'Mode build: ' + MODE_BUILD);

export default defineConfig({
  context: __dirname,
  target: 'node22.8',
  devtool: 'source-map',

  entry: {
    main: './src/main.tsx',
  },
  resolve: {
    extensions: ['...', '.ts', '.tsx', '.jsx'],
    fallback: {
      Buffer: 'buffer',
      process: 'process/browser',
    },
    extensionAlias: {
      '.js': ['.ts', '.js'],
    },
    alias: {
      '@assets': resolve(__dirname, 'src/assets'),
    },
  },
  devServer: {
    compress: true,
    host: HOST,
    port: PORT,
    open: OPEN_IN_BROWSER,

    client: {
      logging: 'info',
      reconnect: true,
      overlay: {
        errors: true,
        warnings: true,
      },
    },

    server: {
      type: useSsl ? SSL : 'http',
    },
  },

  module: {
    rules: [
      {
        test: /\.svg$/,
        type: 'asset',
      },
      {
        test: /\.png$/,
        type: 'asset/resource',
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: {
                  tailwindcss: {},
                  autoprefixer: {},
                },
              },
            },
          },
        ],
        type: 'css',
      },
      {
        test: /\.(jsx?|tsx?)$/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                    development: isDevelopment,
                    refresh: isDevelopment,
                  },
                },
              },
              env: { targets },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './index.html',
    }),
    new RefreshPlugin(),
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),

    isDevelopment &&
      new RsdoctorRspackPlugin({
        linter: {
          rules: {
            'ecma-version-check': 'Ignore',
          },
        },
      }),
  ].filter(Boolean),
  optimization: {
    minimize: true,
    runtimeChunk: 'single',
    moduleIds: 'deterministic',
    realContentHash: true,
    innerGraph: true,
    splitChunks: {
      chunks: 'all',
    },

    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin({
        minimizerOptions: {
          compress: true,
          format: {
            comments: false,
            ecma: 2024,
          },
        },
      }),
      new rspack.LightningCssMinimizerRspackPlugin({
        minimizerOptions: {
          errorRecovery: false,
        },
      }),
    ],
  },

  experiments: {
    css: true,
    futureDefaults: true,
  },
});
