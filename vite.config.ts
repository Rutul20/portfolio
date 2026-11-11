import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type UserConfig } from 'vite'

// https://vite.dev/config/
const config: UserConfig = {
  plugins: [react(), tailwindcss()],
  base: './',
}

export default defineConfig(config)

