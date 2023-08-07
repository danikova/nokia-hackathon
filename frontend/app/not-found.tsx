import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className='w-4/5 mx-auto mt-20 flex flex-col justify-center items-center space-y-4'>
      <Image alt='cat-404' src={'/cat-404.avif'} width={400} height={400} />
      <h1 className='text-4xl font-semibold'>Page Not Found</h1>
      <Link href={'/'} className='text-primary hover:underline'>Go back to Homepage</Link>
    </div>
  );
}