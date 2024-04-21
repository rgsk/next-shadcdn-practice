import {
  DependencyList,
  RefObject,
  useCallback,
  useEffect,
  useState,
} from 'react';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';

const useResizeObserver = <T extends HTMLElement>(
  elementRef: RefObject<T>,
  deps: DependencyList = []
) => {
  const [rect, setRect] = useState<DOMRect>();

  const updateRect = useCallback(() => {
    if (elementRef.current) {
      setRect(elementRef.current.getBoundingClientRect());
    }
  }, [elementRef]);

  // update rect at start
  useIsomorphicLayoutEffect(() => {
    updateRect();
  }, []);

  // update rect according to resizeObserver
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      updateRect();
    });

    if (elementRef.current) {
      resizeObserver.observe(elementRef.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, [elementRef, updateRect]);

  // update rect when dependencies change
  useEffect(() => {
    updateRect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return rect;
};
export default useResizeObserver;
