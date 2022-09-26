export default function ({ data }) {
  // 1.0.1 -> 1.0.2
  if (!data.config.xField) {
    data.config.xField = 'year';
  }
  if (!data.config.yField) {
    data.config.yField = 'value';
  }

  /** 1.0.2->1.0.3 */
  if (!data.tempAnnotations)
    data.tempAnnotations = [];

  return true;
}