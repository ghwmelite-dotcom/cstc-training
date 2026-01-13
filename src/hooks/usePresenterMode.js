import { useState, useEffect, useCallback, useRef } from 'react';

export function usePresenterMode() {
  const [isPresenterOpen, setIsPresenterOpen] = useState(false);
  const presenterWindow = useRef(null);
  const channel = useRef(null);

  useEffect(() => {
    // Create broadcast channel for communication
    channel.current = new BroadcastChannel('presenter-sync');

    channel.current.onmessage = (event) => {
      if (event.data.type === 'presenter-closed') {
        setIsPresenterOpen(false);
        presenterWindow.current = null;
      }
    };

    return () => {
      channel.current?.close();
    };
  }, []);

  const openPresenterView = useCallback(() => {
    if (presenterWindow.current && !presenterWindow.current.closed) {
      presenterWindow.current.focus();
      return;
    }

    const width = 800;
    const height = 600;
    const left = window.screen.width - width - 50;
    const top = 50;

    presenterWindow.current = window.open(
      `${window.location.origin}${window.location.pathname}?presenter=true`,
      'presenter',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes`
    );

    if (presenterWindow.current) {
      setIsPresenterOpen(true);

      presenterWindow.current.onbeforeunload = () => {
        setIsPresenterOpen(false);
        presenterWindow.current = null;
      };
    }
  }, []);

  const closePresenterView = useCallback(() => {
    if (presenterWindow.current && !presenterWindow.current.closed) {
      presenterWindow.current.close();
    }
    setIsPresenterOpen(false);
    presenterWindow.current = null;
  }, []);

  const syncState = useCallback((state) => {
    channel.current?.postMessage({
      type: 'sync-state',
      ...state,
    });
  }, []);

  const isPresenterView = typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('presenter') === 'true';

  return {
    isPresenterOpen,
    isPresenterView,
    openPresenterView,
    closePresenterView,
    syncState,
    channel: channel.current,
  };
}
