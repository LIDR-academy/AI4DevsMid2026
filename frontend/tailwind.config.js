/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        hanken: ['"Hanken Grotesk"', 'sans-serif'],
        arimo: ['Arimo', 'sans-serif'],
        space: ['"Space Mono"', 'monospace'],
      },
      colors: {
        // Brutalist Design System Colors
        surface: '#f9f9f9',
        'surface-dim': '#dadada',
        'surface-bright': '#f9f9f9',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f3f3f3',
        'surface-container': '#eeeeee',
        'surface-container-high': '#e8e8e8',
        'surface-container-highest': '#e2e2e2',
        'on-surface': '#1a1c1c',
        'on-surface-variant': '#484831',
        'inverse-surface': '#2f3131',
        'inverse-on-surface': '#f1f1f1',
        outline: '#79785f',
        'outline-variant': '#cac8aa',
        'surface-tint': '#626200',
        primary: {
          DEFAULT: '#626200',
          container: '#ffff00',
          dark: '#1d4ed8',
        },
        'on-primary': '#ffffff',
        'on-primary-container': '#757500',
        'inverse-primary': '#cdcd00',
        secondary: {
          DEFAULT: '#0035c6',
          container: '#0448ff',
        },
        'on-secondary': '#ffffff',
        'on-secondary-container': '#d6daff',
        tertiary: {
          DEFAULT: '#5e5e5e',
          container: '#f7f7f7',
        },
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#717171',
        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        'primary-fixed': '#eaea00',
        'primary-fixed-dim': '#cdcd00',
        'on-primary-fixed': '#1d1d00',
        'on-primary-fixed-variant': '#494900',
        'secondary-fixed': '#dde1ff',
        'secondary-fixed-dim': '#b9c3ff',
        'on-secondary-fixed': '#001257',
        'on-secondary-fixed-variant': '#0033c0',
        'tertiary-fixed': '#e2e2e2',
        'tertiary-fixed-dim': '#c6c6c6',
        'on-tertiary-fixed': '#1b1b1b',
        'on-tertiary-fixed-variant': '#474747',
        background: '#f9f9f9',
        'on-background': '#1a1c1c',
        'surface-variant': '#e2e2e2',
        // Legacy tokens for compatibility
        success: '#16a34a',
        warning: '#f59e0b',
        danger: '#dc2626',
        muted: '#6b7280'
      },
      spacing: {
        unit: '4px',
        gutter: '24px',
        'margin-desktop': '48px',
        'margin-mobile': '16px',
        'stack-sm': '8px',
        'stack-md': '16px',
        'stack-lg': '32px',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
};


