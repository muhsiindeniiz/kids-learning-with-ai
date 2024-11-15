import localFont from 'next/font/local'

export const localInter = localFont({
  variable: '--font-inter',
  src: [
    {
      path: '../asset/font/inter/inter-roman.woff2',
      weight: '300 900',
      style: 'normal',
    },
    {
      path: '../asset/font/inter/inter-italic.woff2',
      weight: '300 900',
      style: 'italic',
    },
  ],
})
