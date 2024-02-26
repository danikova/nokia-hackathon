import { cn } from "@/lib/utils";
import { BiLogOut } from "react-icons/bi";
import { enqueueSnackbar } from "notistack";
import { minidenticon } from "minidenticons";
import { useCallback, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";
import { UserRecord } from "@/@data/users.type";

export default function UserButton() {
  // const router = useRouter();
  // const pb = usePocketBase();
  // const model = useUserModel();
  const model: UserRecord = {
    name: "John Doe",
    username: "johndoe",
    email: "johndoe@example.com",
    avatarUrl: "https://example.com/avatar.jpg",
    collectionId: "123",
    collectionName: "users",
    created: "2022-01-01T00:00:00Z",
    emailVisibility: true,
    id: "123",
    role: "user",
    updated: "2022-01-01T00:00:00Z",
    verified: true,
  };
  const name = useMemo(() => model?.name || model?.username, [model]);

  const logout = useCallback(() => {
    // pb.authStore.clear();
    // logoutFlow();
    // router.push("/login");
    enqueueSnackbar("Successful logout", { variant: "success" });
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-8 w-8 rounded-full">
        {model ? (
          <UserAvatar user={model} />
        ) : (
          <Skeleton className="h-8 w-8 rounded-full" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-4">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <p>{name}</p>
            <p className="text-[13px] -mt-1 opacity-75">{model?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <BiLogOut className="w-5 h-5 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UserAvatar({
  user,
  className,
}: {
  user: UserRecord;
  className?: string;
}) {
  const name = useMemo(() => user?.name || user?.username, [user]);
  const fallback = useMemo(() => {
    if (!name) return null;
    const parts = name.split(" ");
    if (parts.length === 1) {
      return name[0].toUpperCase();
    } else {
      return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
    }
  }, [name]);

  const avatarURI = useMemo(() => {
    if (user?.avatarUrl) return user?.avatarUrl;
    else
      return (
        "data:image/svg+xml;utf8," +
        encodeURIComponent(minidenticon(name, 100, 50))
      );
  }, [name, user]);

  return (
    <Avatar className={cn("bg-background", className)}>
      <AvatarImage src={avatarURI} alt={name} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
