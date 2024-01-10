export const success = (data: any) => ({ data });

export const fail = (message: string[]) => ({ message, data: null });
