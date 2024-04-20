// src/app/fonts.ts

import { Inter, Lusitana, Montserrat, Noto_Sans_JP } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });

export const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin'],
});

export const montserrat = Montserrat({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
});

export const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
});