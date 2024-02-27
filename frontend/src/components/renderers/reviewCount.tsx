import { ICellRendererParams } from 'ag-grid-community';
import { WorkspaceRankingRecord } from '@/@data/workspaceRankings.types';
import { NumberRenderer } from './number';

export function ReviewCountRenderer({
  value,
}: ICellRendererParams<WorkspaceRankingRecord>) {
  return (
    <NumberRenderer
      className="origin-left scale-[1.15]"
      hideDecimal
      num={value}
    />
  );
}
