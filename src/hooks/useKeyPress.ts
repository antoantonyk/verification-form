import { useEffect } from "react";

const useKeyPress = (cb: (key: string) => void) => {
  useEffect(() => {
    const downHandler = ({ key }: KeyboardEvent) => {
      cb(key);
    };

    window.addEventListener("keydown", downHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, [cb]);
};

export default useKeyPress;
