import { RefObject, useEffect, useRef } from "react";

export default function useClickOutside(
  callback: () => void,
  initialRef?: RefObject<HTMLElement>
) {
  const ref = useRef<HTMLDivElement>(null);

  function handleClickOutside(event: MouseEvent) {
    if (
      initialRef &&
      initialRef.current &&
      initialRef.current.contains(event.target as Node)
    )
      return callback();

    if (ref.current && !ref.current.contains(event.target as Node))
      return callback();
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
