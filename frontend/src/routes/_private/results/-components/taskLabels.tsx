import { useIsWorkspaceBusy } from '@/@data/workspaceEvents';
import Spinner from '@/components/spinner';

export function TaskLabels({ taskKeys }: { taskKeys: string[] }) {
  const isLoading = useIsWorkspaceBusy();

  return (
    <>
      {taskKeys.map(key => (
        <div key={key} className="flex justify-between text-lg">
          <div>{key}</div>
          {isLoading && (
            <div className="h-5 w-5">
              <Spinner />
            </div>
          )}
        </div>
      ))}
    </>
  );
}
