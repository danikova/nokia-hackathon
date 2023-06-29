/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary_text: 'rgb(117, 117, 117)',
        primary: { DEFAULT: '#2558F6', 50: '#D5DFFD', 100: '#C2D0FC', 200: '#9BB2FB', 300: '#7394F9', 400: '#4C76F8', 500: '#2558F6', 600: '#093CDA', 700: '#072DA4', 800: '#051E6E', 900: '#020F38', 950: '#01081D' },
        secondary: {
          bg: 'rgb(255,255,255)',
          menu: 'rgb(250,250,250)',
          divider: 'rgb(224,224,224)',
        },
        error: 'rgb(199,44,32)',
        warning: 'rgb(238,129,49)',
        info: 'rgb(77,155,242)',
        success: 'rgb(138,201,193)',
      },
      dropShadow: {
        'default': '0 0.25rem 0.25rem rgba(0,0,0,0.40)'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
