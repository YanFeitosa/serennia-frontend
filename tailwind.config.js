/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    // 🔒 Força geração das classes de cores do Serenna
    'bg-primary',
    'bg-primary-light',
    'bg-primary-dark',
    'bg-secondary',
    'bg-accent',
    'bg-accent-light',
    'text-primary',
    'text-primary-light',
    'text-primary-dark',
    'text-secondary',
    'text-accent',
    'text-accent-light',
    'border-primary',
    'border-secondary',
    'border-accent',
  ],
  theme: {
    extend: {
      colors: {
        // 🎨 Serenna UI System - Cores principais
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
        },
        secondary: 'var(--color-secondary)',
        accent: {
          DEFAULT: 'var(--color-accent)',
          light: 'var(--color-accent-light)',
        },
        text: {
          DEFAULT: 'var(--color-text)',
          muted: 'var(--color-text-muted)',
        },
        background: 'var(--color-background)',
        border: 'var(--color-border)',
        card: 'var(--color-card)',
        sidebar: 'var(--color-sidebar)',

        // Mapear utilitários padrão para o sistema de design (status + escala de cinza)
        red: {
          500: 'color-mix(in srgb, var(--color-status-error) 85%, var(--color-background) 15%)',
          600: 'var(--color-status-error)',
          700: 'color-mix(in srgb, var(--color-status-error) 85%, var(--color-text) 15%)',
        },
        green: {
          600: 'var(--color-status-success)',
        },
        gray: {
          700: 'var(--color-text)',
          500: 'var(--color-text-muted)',
          400: 'color-mix(in srgb, var(--color-text-muted) 80%, var(--color-background) 20%)',
          300: 'var(--color-border)',
          200: 'color-mix(in srgb, var(--color-border) 80%, var(--color-background) 20%)',
          100: 'color-mix(in srgb, var(--color-card) 80%, var(--color-background) 20%)',
        },

        // Aliases para compatibilidade
        'accent-foreground': 'var(--color-text)',
        input: 'var(--color-text)',
        ring: 'var(--color-primary)',
        textLight: '#FFFFFF',
        white: '#FFFFFF',
        black: '#000000',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',   // Padrão Serenna
        '2xl': '1rem',
      },
      boxShadow: {
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'serenna': '0 2px 8px -1px rgb(90 111 142 / 0.1), 0 1px 4px -1px rgb(90 111 142 / 0.06)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'fade-in': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.2s ease-out',
      },
      transitionDuration: {
        '200': '200ms',
      },
    },
  },
  plugins: [],
}
