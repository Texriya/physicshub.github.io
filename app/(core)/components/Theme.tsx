"use client";

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

interface Props {
  mode: 'light' | 'dark';
  onToggle: () => void;
}

export function Theme({ mode, onToggle }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label="Toggle theme"
    >
      {mounted ? (
        <FontAwesomeIcon icon={mode === 'dark' ? faMoon : faSun} />
      ) : (
        <span style={{ width: 16, height: 16, display: 'inline-block' }} />
      )}
    </button>
  );
}
