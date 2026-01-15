import type { ForgeConfig } from '@electron-forge/shared-types';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import webpack from 'webpack';
import path from 'path';

const config: ForgeConfig = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32', 'darwin'],
    },
  ],
  plugins: [
    new WebpackPlugin({
      port: 9000,
      mainConfig: {
        entry: './desktop/main/main.ts',
        module: {
          rules: require('./webpack.rules'),
        },
        resolve: {
          extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
        },
        plugins: [
          new webpack.DefinePlugin({
            __dirname: JSON.stringify(''),
            global: 'globalThis',
            'process.env': JSON.stringify(process.env),
          }),
        ],
      },
      renderer: {
        config: {
          module: {
            rules: require('./webpack.rules'),
          },
          resolve: {
            extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
          },
          plugins: [
            new webpack.DefinePlugin({
              __dirname: JSON.stringify(''),
              global: 'window',
              'process.env': JSON.stringify(process.env),
            }),
          ],
        },
        devServer: {
          port: 9000,
        },
        entryPoints: [
          {
            html: './desktop/renderer/index.html',
            js: './desktop/renderer/index.tsx',
            name: 'main_window',
            preload: {
              js: './desktop/preload/preload.ts',
            },
          },
        ],
      },
    }),
  ],
};

export default config;
