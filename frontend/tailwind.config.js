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
        primary: 'rgb(37, 88, 246)',
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
      gridTemplateColumns: {
        main: '4rem 1fr',
      },
      gridTemplateRows: {
        main: '3rem 1fr 4rem',
      }
    },
  },
  plugins: [],
}
