import { ReactElement } from 'react';

type ButtonProps = {
  text?: string;
  children?: ReactElement | string;
  onClick?: any;
  className?: string;
  disabled?: boolean;
  [k: string]: any;
};

export default function Button({ text, children, className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`
      text-white bg-gradient-to-r from-primary via-primary to-blue-700 
      hover:bg-gradient-to-br focus:ring-4 focus:outline-none 
      focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg 
      shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 
      font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 
      ${props.disabled ? 'opacity-70' : ''}
      ${className}`}
      {...props}
    >
      {text && <p>{text}</p>}
      {children}
    </button>
  );
}
