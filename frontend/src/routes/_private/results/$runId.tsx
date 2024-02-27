// import { Expandable } from '@/@data/base.types';
// import { WorkspaceRecord } from '@/@data/workspaces.types';
// import { RunResultRecord } from '@/@data/runResults.types';
// import BreadCrumb from '@/components/navigation/breadCrumb';
// import RunResultDisplay from '@/components/runResultDisplay';
// import { navBarItems } from '@/components/navigation/navBarItems';
// import { getGroupedKeys, getGroupedRunResults } from './-components/helpers';
// import { useRunResults } from '@/@data/runResults';
// import { useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/results/$runId')({
  component: RunDetail,
});

function RunDetail() {
  return <div>Hello from runresult details</div>;
}

// type ExpandedRunResultRecord = RunResultRecord &
//   Expandable<{ workspace: WorkspaceRecord }>;

// function RunDetail({ params }: { params: { runId: number } }) {
//   const { data } = useRunResults();
//   const runResults = useMemo(
//     () => (data?.items ?? []) as never as ExpandedRunResultRecord,
//     [data]
//   );

//   if (runResults && runResults[0] && !runResults[0].is_success)
//     return (
//       <DetailWrapper runId={params.runId}>
//         <RunResultDisplay runResult={runResults[0]} defaultOpen={true} />
//       </DetailWrapper>
//     );

//   const groupedRunResults = new Map(
//     [...getGroupedRunResults(runResults, 'task').entries()].sort()
//   );
//   return (
//     <DetailWrapper runId={params.runId}>
//       <>
//         {getGroupedKeys(groupedRunResults).map(key => {
//           const firstRunResult = groupedRunResults.get(key)![0];
//           let repo_url = firstRunResult?.expand?.workspace?.repo_url;
//           repo_url = repo_url?.endsWith('/') ? repo_url : repo_url + '/';
//           return firstRunResult ? (
//             <RunResultDisplay
//               key={key}
//               runResult={firstRunResult}
//               href={`${repo_url}/actions/runs/${params.runId}`}
//             />
//           ) : null;
//         })}
//       </>
//     </DetailWrapper>
//   );
// }

// function DetailWrapper({
//   children,
//   runId,
// }: {
//   children: JSX.Element | JSX.Element[];
//   runId: number;
// }) {
//   return (
//     <div className="m-16 flex flex-col gap-8 max-md:m-8">
//       <BreadCrumb items={[navBarItems[1], { title: `Details of ${runId}` }]} />
//       {children}
//     </div>
//   );
// }
