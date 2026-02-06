import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.jsx",
            refresh: true,
        }),
        react(),
    ],
    optimizeDeps: {
        include: ["pdfjs-dist"],
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    "pdfjs-dist": ["pdfjs-dist"],
                },
            },
        },
    },
    server: {
        fs: {
            allow: [".."],
        },
    },
});
