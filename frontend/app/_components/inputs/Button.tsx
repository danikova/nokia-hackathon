import clsx from 'clsx';
import { ReactElement } from 'react';

type ButtonProps = {
  variant?: 'call-to-action' | 'normal';
  text?: string;
  children?: ReactElement | string;
  onClick?: any;
  className?: string;
  disabled?: boolean;
  [k: string]: any;
};

export default function Button({ text, children, className, variant = 'normal', ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={
        clsx(` 
          hover:bg-gradient-to-br focus:ring-4 focus:outline-none 
          focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg 
          shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 
          font-medium rounded-md text-sm px-5 text-center`,
          variant === 'call-to-action' && 'text-white bg-gradient-to-r from-primary via-primary to-blue-700 py-2.5',
          variant === 'normal' && 'from-inherit via-inherit to-inherit text-primary border-primary border-2 py-[8px]',
          props.disabled && 'opacity-60',
          className)
      }
      {...props}
    >
      {text && <p>{text}</p>}
      {children}
    </button>
  );
}
