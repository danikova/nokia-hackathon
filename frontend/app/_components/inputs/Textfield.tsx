import { ForwardedRef, forwardRef } from 'react';

type TextfieldProps = {
  type: 'text' | 'email' | 'password';
  label?: string;
  value?: string;
  onChange?: any;
  className?: string;
  error?: any;
  [k: string]: any;
};

export default forwardRef<HTMLInputElement, TextfieldProps>(function Textfield({ label, className, error, ...rest }, ref) {
  return (
    <>
      {label && <label className='text-sm -mb-[16px] opacity-60'>{label}</label>}
      <input
        ref={ref}
        className={`
      mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-primary 
      placeholder:opacity-30
      ${error !== undefined ? 'ring-0 border-red-500' : ''}
      ${className}
      `}
        {...rest}
      />
    </>
  );
});
