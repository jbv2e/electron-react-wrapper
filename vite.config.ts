import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'
import tsconfigPaths from "vite-tsconfig-paths"


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    tsconfigPaths(),
    electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: 'electron/main.ts',
        // onstart(options) {
        //   options.startup()
        // },
        // vite: {
        //   build: {
        //     sourcemap: true, // 이 부분 추가
        //   },
        // },
      },

      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: path.join(__dirname, 'electron/preload.ts'),
        // onstart(options) {
        //   options.startup()
        // },
        // vite: {
        //   build: {
        //     sourcemap: true, // 이 부분 추가
        //   },
        // },
      },
      // Ployfill the Electron and Node.js API for Renderer process.
      // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer:
        process.env.NODE_ENV === 'test'
          ? // https://github.com/electron-vite/vite-plugin-electron-renderer/issues/78#issuecomment-2053600808
            undefined
          : {},
    }),
    
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // "#app": path.resolve(__dirname, "src")
    },
  },
})
