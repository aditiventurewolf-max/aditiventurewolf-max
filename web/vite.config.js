import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
// One self-contained HTML file (JS and CSS inlined). Images in public/ stay as files beside it.
export default defineConfig({ base: './', plugins: [react(), viteSingleFile()], build: { assetsInlineLimit: 0, chunkSizeWarningLimit: 4000 } })
