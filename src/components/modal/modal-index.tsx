import React, { useEffect, useRef, ReactNode, FC } from 'react';
import clsx from 'clsx';
import { useModal } from '@/contexts/ModalProvider';

type ModalProps = {

  className?: string;
};

const Modal: FC<ModalProps> = ({ className  }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);


  const { isOpen, onClose, children } = useModal();

  // useEffect(() => {
  //   function handleOutsideClick(event: MouseEvent) {
  //     if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
  //       onClose();
  //     }
  //   }

  //   if (isOpen) {
  //     window.addEventListener('mousedown', handleOutsideClick);
  //   }

  //   return () => {
  //     window.removeEventListener('mousedown', handleOutsideClick);
  //   };
  // }, [open, onClose]);

  
  if (!isOpen) {
    console.log('Modal not open');
    return null;
  }

  console.log(isOpen);


  return (
    <div
    id = "modal"
      className={clsx(
        'fixed bg-black inset-0 bg-black w-[400px] h-[500px] flex items-center justify-center z-50',
      )}
    >
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div ref={modalRef} className={clsx('relative bg-white p-6 rounded-lg', className)}>
      </div>
    </div>
  );
};

export default Modal;
