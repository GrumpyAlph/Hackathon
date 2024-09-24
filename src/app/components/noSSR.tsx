import { ReactNode, useEffect, useLayoutEffect, useState } from "react";

const useEnhancedEffect =
  typeof window !== "undefined" && process.env.NODE_ENV !== "test"
    ? useLayoutEffect
    : useEffect;

export interface noSSRProps {
    children?: ReactNode;
    defer?: boolean,
    fallback?: ReactNode,
}


const NoSSR : React.FC<noSSRProps> =  ({ children, defer, fallback }) => {
  const [isMounted, setMountedState] = useState(false);

  useEnhancedEffect(() => {
    if (!defer) setMountedState(true);
  }, [defer]);

  useEffect(() => {
    if (defer) setMountedState(true);
  }, [defer]);
 
  return isMounted ? children : fallback;
};


export default NoSSR;