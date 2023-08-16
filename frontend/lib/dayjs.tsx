'use client';

import dayjs from "dayjs";
import { useMemo } from "react";

import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

var thresholds = [
  { l: 's', r: 1 },
  { l: 'm', r: 1 },
  { l: 'mm', r: 59, d: 'minute' },
  { l: 'h', r: 1 },
  { l: 'hh', r: 23, d: 'hour' },
  { l: 'd', r: 1 },
  { l: 'dd', r: 29, d: 'day' },
  { l: 'M', r: 1 },
  { l: 'MM', r: 11, d: 'month' },
  { l: 'y', r: 1 },
  { l: 'yy', d: 'year' },
];
var rounding = Math.ceil;

dayjs.extend(duration);
dayjs.extend(relativeTime, {
  thresholds,
  rounding,
});

export default function FromNow({ date }: { date: Date | string }) {
  const _date = useMemo(() => new Date(date), [date]);

  return <>
    {dayjs(_date).fromNow()}
  </>;
}