/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        collab: '#bf2d1a',
        data: '#90479b',
        instr: '#0070c0',
        itens: '#db632d',
      },
    },
  },
  plugins: [],
};
