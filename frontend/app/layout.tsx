import './globals.css';
import Snackbar from './Snackbar';
import localFont from 'next/font/local';

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
    <html lang="en">
      <body className={nokiaFont.className}>
        <main>
          {children}
          <Snackbar />
        </main>
      </body>
    </html>
  );
}
