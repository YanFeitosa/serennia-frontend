/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    // 🔒 Força geração das classes de cores do Serennia
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
    // Novas classes de gradiente e efeitos
    'gradient-primary-secondary',
    'gradient-primary-accent',
    'gradient-full',
    'gradient-subtle',
    'gradient-text',
    'glass',
    'glass-card',
    'glow-primary',
    'glow-accent',
    'shadow-elevated',
    'animate-blob',
    'animate-blob-delayed',
    'animate-gradient',
    'landing-theme',
  ],
  theme: {
    extend: {
      colors: {
        // 🎨 Serennia UI System - Cores principais
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

        // Landing theme colors (fixas)
        landing: {
          bg: '#0a0a0f',
          text: '#ffffff',
          muted: '#9ca3af',
          purple: '#7c3aed',
          blue: '#3b82f6',
          pink: '#ec4899',
        },

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
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'serennia': '0 2px 8px -1px rgb(90 111 142 / 0.1), 0 1px 4px -1px rgb(90 111 142 / 0.06)',
        'glow-primary': 'var(--shadow-glow-primary)',
        'glow-accent': 'var(--shadow-glow-accent)',
        'glow-secondary': 'var(--shadow-glow-secondary)',
        'elevated': 'var(--shadow-elevated)',
        // Landing shadows
        'landing-purple': '0 0 30px rgba(124, 58, 237, 0.3)',
        'landing-glow': '0 0 40px rgba(124, 58, 237, 0.4), 0 0 60px rgba(59, 130, 246, 0.3)',
      },
      backgroundImage: {
        // Gradientes dinâmicos (personalizáveis por salão)
        'gradient-primary-secondary': 'var(--gradient-primary-secondary)',
        'gradient-primary-accent': 'var(--gradient-primary-accent)',
        'gradient-secondary-accent': 'var(--gradient-secondary-accent)',
        'gradient-full': 'var(--gradient-full)',
        'gradient-subtle': 'var(--gradient-subtle-primary)',
        'gradient-subtle-accent': 'var(--gradient-subtle-accent)',
        // Gradientes landing (fixos)
        'landing-gradient': 'linear-gradient(to right, #7c3aed, #3b82f6)',
        'landing-gradient-accent': 'linear-gradient(to right, #7c3aed, #ec4899)',
        'landing-gradient-full': 'linear-gradient(to right, #7c3aed, #ec4899, #3b82f6)',
        'landing-gradient-text': 'linear-gradient(to right, #a78bfa, #f472b6, #60a5fa)',
      },
      backdropBlur: {
        'glass': 'var(--glass-blur)',
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
        'blob-float': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.2s ease-out',
        'blob': 'blob-float 7s ease-in-out infinite',
        'blob-delayed': 'blob-float 7s ease-in-out infinite 2s',
        'blob-delayed-2': 'blob-float 7s ease-in-out infinite 4s',
        'gradient': 'gradient-shift 3s ease infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      transitionDuration: {
        '200': '200ms',
      },
    },
  },
  plugins: [],
}
