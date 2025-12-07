import React, { useCallback, useState, useEffect } from 'react';

export type PageType = '/' | '/dashboard' | '/monitoreo' | '/buses';

let currentPage: PageType = '/';
let listeners: (() => void)[] = [];

export const useNavigate = () => {
  const navigate = useCallback((path: PageType) => {
    currentPage = path;
    listeners.forEach((l) => l());
  }, []);
  return navigate;
};

export const usePage = () => {
  const [, setUpdate] = useState({});

  useEffect(() => {
    const listener = () => setUpdate({});
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return currentPage;
};
