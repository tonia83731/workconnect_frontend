/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: 'rgb(20, 22, 22)',
        'dark-60': 'rgb(20, 22, 22, .6)',
        'pale-aqua': '#F0F7F7',
        'soft-aqua': '#AEDADA',
        'ocean-teal': '#016766',
        'ocean-teal-60': 'rgb(1, 103, 102, .6)',
        'midnight-forest': '#0D2D2C',
        'midnight-forest-60': 'rgb(13, 45, 44, .6)',
        'midnight-forest-40': 'rgb(13, 45, 44, .4)',
        'sky-blue': '#4A90E2 ',
        'golder-amber': '#FEBC00',
        'light-amber': '#FFFDE9',
        peach: '#FF886C',
        'light-peach': '#FFF6F3',
        error: '#FF4C4C',
        'disabled-gray': '#D3D3D3',
        'disabled-gray-60': 'rgb(211, 211, 211, .6)',
        'muted-gray': '#B0B0B0',
        'muted-gray-60': 'rgb(176, 176, 176, .6)',
      },
    },
  },
  plugins: [],
}

// https://www.pinterest.com/pin/1407443629067462/
