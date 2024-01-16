'use client'
import { createContext, FC, ReactNode, useState } from 'react';
import { Modal } from '../components/modal/modal-index';
import React from 'react';


type ModalContextType = {
  content: ReactNode;
  isOpen: boolean;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
};

export const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider: FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = ( ) => {
    console.log('openModal');
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider value={{  isOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};


export const useModal = () => {
    const context = React.useContext(ModalContext);
    if (context === null) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
    };