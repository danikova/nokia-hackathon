import { ForwardedRef, forwardRef } from 'react';

type TextfieldProps = {
  value?: string;
  onChange?: any;
  type: 'text' | 'email' | 'password';
  placeholder?: string;
  className?: string;
  error?: any;
  [k: string]: any;
};

export default forwardRef<HTMLInputElement, TextfieldProps>(function Textfield({ className, error, ...rest }, ref) {
  return (
    <input
      ref={ref}
      className={`
      mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-primary 
      ${error !== undefined ? 'ring-0 border-red-500' : ''}
      ${className}
      `}
      {...rest}
    />
  );
});
