module.exports = {
  purge: {
    enabled: false,
    content: ['./public/**/*.html', '*.html']
  },
  theme: {
    debugScreens: {
      // position: ['top', 'left']
    },
    extend: {     
      fontFamily: {
        mainFont: 'Helvetica',
      },      
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    // require('tailwindcss-debug-screens')
  ],
}
