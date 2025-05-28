/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neon: {
          primary: '#00ff9d',
          secondary: '#ff00ff',
          accent: '#00ffff',
          dark: '#0a0a0a',
          light: '#ffffff'
        },
        cyber: {
          dark: '#0f172a',
          darker: '#020617',
          light: '#f8fafc',
          accent: '#3b82f6'
        }
      },
      animation: {
        'glitch': 'glitch 1s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'text-shimmer': 'shimmer 2s linear infinite',
        'border-flow': 'borderFlow 3s linear infinite',
        'matrix-rain': 'matrixRain 20s linear infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' }
        },
        borderFlow: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        matrixRain: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 100%' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)',
        'neon-glow': 'radial-gradient(circle at center, rgba(0, 255, 157, 0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'neon': '0 0 5px theme(colors.neon.primary), 0 0 20px theme(colors.neon.primary)',
        'neon-secondary': '0 0 5px theme(colors.neon.secondary), 0 0 20px theme(colors.neon.secondary)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
} 