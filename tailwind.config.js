/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        purple: '#3D3D61',
        'purple-50': 'rgb(61, 61, 97, .5)',
        'purple-30': 'rgb(61, 61, 97, .3)',
        'teal-gray': '#3E5159',
        'teal-gray-50': 'rgb(62, 81, 89, .5)',
        'teal-gray-30': 'rgb(62, 81, 89, .3)',
        'teal-blue': '#A2C8D2',
        taro: '#BBA6C8',
        gypsum: '#EFEDE4',
        gray: '#55545C',
        'gray-50': 'rgb(85, 84, 92, .5)',
        'gray-30': 'rgb(85, 84, 92, .3)',
        error: '#9C3D3D',
        tiffany: '#63C2C2',
        'tiffany-50': 'rgb(99, 194, 194, .5)',
      },
    },
  },
  plugins: [],
}

// https://www.pinterest.com/pin/1407443629067462/
