
export default function ErrorText({ children }: { children: any }) {
  if (children)
    return <p className='text-red-400 my-2'>{children}</p>
  return null;
}