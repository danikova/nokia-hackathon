import { ICellRendererParams } from "ag-grid-community";
import { RunStatisticRecord } from "@/@data/customViews.types";
import { OutputSimilarityRenderer as OSR } from "../runResultDisplay";

export function OutputSimilarityRenderer(
  props: ICellRendererParams<RunStatisticRecord>
) {
  const outputSimilarity = props.valueFormatted
    ? props.valueFormatted
    : props.value;
  return <OSR value={outputSimilarity} />;
}
