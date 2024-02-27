import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { minidenticon } from "minidenticons";
import { UserRecord } from "@/@data/users.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
