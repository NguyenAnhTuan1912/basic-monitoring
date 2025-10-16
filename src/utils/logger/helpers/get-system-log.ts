/**
 * Get "header" of log (System log). Format of log must be `string`
 * @param info
 * @returns
 */
export default function getSystemlog(info: any) {
  if (info.durationMs || info.durationMs === 0)
    return `${info.timestamp} [${info.level}] [${info.durationMs}ms] ${info.label}`;
  return `${info.timestamp} [${info.level}] ${info.label}`;
}
