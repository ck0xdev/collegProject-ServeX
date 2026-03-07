/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        apple: {
          bg: '#f5f5f7',      // Signature off-white background
          blue: '#0071e3',    // Apple's primary blue
          card: 'rgba(255, 255, 255, 0.65)', // High translucency
          text: '#1d1d1f'     // Deep gray/black text
        }
      },
      borderRadius: {
        'apple-xl': '2.5rem', // Smooth continuous curves
      },
      backdropBlur: {
        'apple': '25px',      // Heavy iOS blur
      },
      boxShadow: {
        'skeuo': 'inset 0 1px 1px rgba(255,255,255,0.4), 0 10px 20px rgba(0,0,0,0.05)',
        'skeuo-press': 'inset 0 2px 4px rgba(0,0,0,0.1)',
      }
    },
  },
  plugins: [],
}