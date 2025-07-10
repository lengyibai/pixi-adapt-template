import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import dayjs from "dayjs";

export default defineConfig(({ mode }) => {
  process.env.VITE_FILE_VERSION = dayjs().valueOf().toString();
  const env = loadEnv(mode, process.cwd());
  const getViteEnv = (target: string): any => env[target];

  return {
    base: "./",
    server: {
      host: "0.0.0.0",
      port: 5000,
      hmr: false,
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      chunkSizeWarningLimit: 2000,
      reportCompressedSize: false,
      cssTarget: "chrome61",
      commonjsOptions: {
        ignoreTryCatch: false,
      },
      rollupOptions: {
        output: {
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        },
      },
    },
  };
});
