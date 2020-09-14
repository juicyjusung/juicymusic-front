export const getKeyValue = (key: string) => (obj: Record<string, any>) => obj[key];
export const updateVo = (vo: any, data: any) => {
  if (!data || !vo) return;
  for (const k in data) {
    const key = k as string;
    if (Object.prototype.hasOwnProperty.call(vo, key)) {
      vo[key] = data[key];
    }
  }
};
