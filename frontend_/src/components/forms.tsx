import * as z from "zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaRegCircleUser } from "react-icons/fa6";
import ClientForm from "@/components/ui/clientForm";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormLogin } from "@/utils/hooks";

const formSchema = z
  .object({
    userIdentifier: z.string().min(1, {
      message: "Email or username is required.",
    }),
    password: z.string().min(1, {
      message: "Password is required.",
    }),
  })
  .required();

export function PasswordLogin({
  setLoading,
}: {
  setLoading: (isLoading: boolean) => void;
}) {
  const { mutateAsync } = useFormLogin(setLoading);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = useCallback(
    async ({ userIdentifier, password }: z.infer<typeof formSchema>) => {
      await mutateAsync({ identity: userIdentifier, password });
    },
    [mutateAsync]
  );

  return (
    <ClientForm
      form={form}
      onSubmit={onSubmit}
      className=" flex flex-col gap-8 max-md:gap-2 md:mt-12 mt-4"
    >
      <FormField
        control={form.control}
        name="userIdentifier"
        render={({ field }) => (
          <FormItem>
            <FormLabel>User identifier</FormLabel>
            <FormControl>
              <Input placeholder="Email or Username" {...field} />
            </FormControl>
            <FormDescription>
              User identifier can be username or email address
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit">
        <div className="flex justify-center">
          <FaRegCircleUser className="text-lg mr-2" />
          <p>Log in</p>
          <p className="max-md:hidden ml-1"> with email and password</p>
        </div>
      </Button>
    </ClientForm>
  );
}
