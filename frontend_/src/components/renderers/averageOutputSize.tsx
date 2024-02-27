import { useMemo } from "react";
import { ICellRendererParams } from "ag-grid-community";
import { RunStatisticRecord } from "@/@data/customViews.types";

function useKformatter(charCount: any) {
  return useMemo(() => {
    try {
      const charCountNumber: number = parseInt(charCount);
      return kFormatter(charCountNumber) + " chars";
    } catch {
      return charCount + " chars";
    }
  }, [charCount]);
}
function kFormatter(num: number) {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.round(Math.abs(num) / 100) / 10) + "k"
    : Math.sign(num) * Math.abs(num);
}

export function AverageOutputSizeRenderer(
  props: ICellRendererParams<RunStatisticRecord>
) {
  const charCount = props.valueFormatted ? props.valueFormatted : props.value;
  const text = useKformatter(charCount);

  return <p>{text}</p>;
}
