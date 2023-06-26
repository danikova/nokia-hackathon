type TextfieldProps = {
  value?: string;
  onChange?: any;
  type: 'text' | 'email' | 'password';
  placeholder?: string;
  className?: string;
  [k: string]: any;
};

export default function Textfield({ className, ...rest }: TextfieldProps) {
  return (
    <input
      className={`mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-primary ${className}`}
      {...rest}
    />
  );
}
