import { useOutsideClickObserver } from "@/lib/hooks";
import { Form } from "@/components/ui/form";
import { ReactElement, useCallback, useRef, useState } from "react";
import FocusLock from "react-focus-lock";
import { UseFormReturn } from "react-hook-form";

interface ClientFormProps
  extends React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > {
  children: ReactElement | ReactElement[];
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  defaultFocus?: boolean;
}

export default function ClientForm({
  children,
  form,
  onSubmit,
  defaultFocus = false,
  ...rest
}: ClientFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isFocused, setIsFocused] = useState(defaultFocus);
  const onClick = useCallback(() => {
    setIsFocused(true);
  }, [setIsFocused]);
  const onNotClick = useCallback(() => {
    setIsFocused(false);
  }, [setIsFocused]);
  useOutsideClickObserver(formRef, onNotClick);

  return (
    <FocusLock disabled={!isFocused}>
      <Form {...form}>
        <form
          {...rest}
          ref={formRef}
          onClick={onClick}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {children}
        </form>
      </Form>
    </FocusLock>
  );
}
