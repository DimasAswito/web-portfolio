import { useEffect, useRef } from 'react';

const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

export default function useKonamiCode(onActivate) {
  const progressRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const pressedKey = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expectedKey = KONAMI_SEQUENCE[progressRef.current];

      if (pressedKey === expectedKey) {
        progressRef.current += 1;
        if (progressRef.current === KONAMI_SEQUENCE.length) {
          progressRef.current = 0;
          onActivate();
        }
      } else {
        progressRef.current = pressedKey === KONAMI_SEQUENCE[0] ? 1 : 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onActivate]);
}
