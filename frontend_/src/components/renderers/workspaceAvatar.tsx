import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ICellRendererParams } from 'ag-grid-community';
import { WorkspaceRecord } from '@/@data/workspaces.types';
import WorkspaceAvatar from '../../routes/_private/settings/-components/workspaceAvatar';

interface WorkspaceAvatarRendererProps extends ICellRendererParams {
  workspace: WorkspaceRecord | null;
}

export function WorkspaceAvatarRenderer(props: WorkspaceAvatarRendererProps) {
  const workspaceId = props.valueFormatted ? props.valueFormatted : props.value;
  const { workspace } = props;

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Tooltip>
        <TooltipTrigger>
          <WorkspaceAvatar workspace={{ id: workspaceId } as WorkspaceRecord} />
        </TooltipTrigger>
        <TooltipContent side="right" hidden={workspace?.id !== workspaceId}>
          This is your workspace
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
