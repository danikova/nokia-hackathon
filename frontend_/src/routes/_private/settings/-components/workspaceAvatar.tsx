import { useMemo } from "react";
import { minidenticon } from "minidenticons";
import { WorkspaceRecord } from "@/@data/workspaces.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function WorkspaceAvatar({
  workspace,
}: {
  workspace: WorkspaceRecord | null;
}) {
  const workspaceId = workspace?.id ?? "";

  const fallback = useMemo(() => {
    if (!workspaceId) return null;
    const parts = workspaceId.split(" ");
    if (parts.length === 1) {
      return workspaceId[0].toUpperCase();
    } else {
      return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
    }
  }, [workspaceId]);
  const avatarURI = useMemo(
    () =>
      "data:image/svg+xml;utf8," +
      encodeURIComponent(minidenticon(workspaceId, 100, 50)),
    [workspaceId]
  );

  return (
    <Avatar className="bg-background">
      <AvatarImage src={avatarURI} alt={fallback || ""} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
