import { useEffect, useState } from 'react';

const STORAGE_KEY = 'lumen-dnd-layout';

export function useLocalLayout() {
  const [savedLayout, setSavedLayout] = useState(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSavedLayout(JSON.parse(raw));
      }
    } catch {
      setSavedLayout(null);
    }
  }, []);

  const saveLayout = (layout) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
      setSavedLayout(layout);
      return true;
    } catch {
      return false;
    }
  };

  const clearLayout = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      setSavedLayout(null);
    } catch {
      // ignore
    }
  };

  return { savedLayout, saveLayout, clearLayout };
}

const CONTRACTS_STORAGE_KEY = 'lumen-dnd-contracts';

export function useCreatedContracts() {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CONTRACTS_STORAGE_KEY);
      if (raw) {
        setContracts(JSON.parse(raw));
      }
    } catch {
      setContracts([]);
    }
  }, []);

  const saveContract = (contract) => {
    try {
      const newContract = {
        ...contract,
        id: contract.id || `contract-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        createdAt: contract.createdAt || new Date().toISOString(),
      };
      const updated = [newContract, ...contracts];
      window.localStorage.setItem(CONTRACTS_STORAGE_KEY, JSON.stringify(updated));
      setContracts(updated);
      return true;
    } catch {
      return false;
    }
  };

  const deleteContract = (contractId) => {
    try {
      const updated = contracts.filter((c) => c.id !== contractId);
      window.localStorage.setItem(CONTRACTS_STORAGE_KEY, JSON.stringify(updated));
      setContracts(updated);
      return true;
    } catch {
      return false;
    }
  };

  return { contracts, saveContract, deleteContract };
}


