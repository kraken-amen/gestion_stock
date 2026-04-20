import React, { createContext, useState, useContext } from 'react';
import ConfirmModal from '../components/ConfirmModel';
import type { ConfirmConfig, ConfirmContextType } from '../types';

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const ConfirmProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ConfirmConfig>({
    title: '',
    confirmValue: '',
    onConfirm: () => {}
  });

  const showConfirm = (title: string, confirmValue: string, onConfirm: () => void) => {
    setConfig({ title, confirmValue, onConfirm });
    setIsOpen(true);
  };

  const closeConfirm = () => setIsOpen(false);

  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
      {children}
      {isOpen && (
        <ConfirmModal 
          config={config} 
          onClose={closeConfirm} 
        />
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};