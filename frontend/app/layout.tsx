import localFont from 'next/font/local';
import Snackbar from './_components/Snackbar';
import { TooltipProvider } from '@/components/ui/tooltip';

import './globals.css';

const nokiaFont = localFont({
  src: [
    {
      path: './_fonts/NokiaPureText-Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: './_fonts/NokiaPureText-Light.woff',
      weight: '200',
      style: 'normal',
    },
    {
      path: './_fonts/NokiaPureText-Medium.woff',
      weight: '600',
      style: 'normal',
    },
    {
      path: './_fonts/NokiaPureText-Bold.woff',
      weight: '700',
      style: 'normal',
    },
  ],
});

export const metadata = {
  title: 'Nokia-Hackathon',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className='max-w-[100vw] max-h-[100vh] overflow-hidden'>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
      </head>
      <body className={nokiaFont.className}>
        <main>
          <TooltipProvider delayDuration={100}>
            {children}
            <Snackbar />
          </TooltipProvider>
        </main>
      </body>
    </html>
  );
}
