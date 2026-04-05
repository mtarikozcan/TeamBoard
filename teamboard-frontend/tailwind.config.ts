import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './types/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          base: '#0a0a0a',
          DEFAULT: '#141414',
          elevated: '#1a1a1a',
          overlay: '#202020',
          subtle: '#2a2a2a',
        },
        border: {
          DEFAULT: '#2a2a2a',
          subtle: '#222222',
        },
        tx: {
          primary: '#f0f0f0',
          secondary: '#a0a0a0',
          muted: '#606060',
          label: '#666666',
        },
      },
    },
  },
  plugins: [],
}
export default config
