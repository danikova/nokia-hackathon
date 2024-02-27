import { ICellRendererParams } from "ag-grid-community";
import { WorkspaceRankingRecord } from "@/@data/workspaceRankings.types";
import { NumberRenderer } from "./number";

export function PointsRenderer({
  value,
}: ICellRendererParams<WorkspaceRankingRecord>) {
  return <NumberRenderer num={value} />;
}
