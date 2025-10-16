export const debounce = (cb: Function, time: number) => {
  let timeout: number;

  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(cb(), time);
  };
};
