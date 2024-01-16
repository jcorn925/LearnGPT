import React, { useState, useEffect, useRef } from 'react';
import styles from './StatusBar.module.scss';
import useOnClickOutside from '@src/components/hooks/useOnClickOutside';
import PomodoroTimer from '../Timer/Timer';
import Icon from '@src/components/IconWrapper/Icon';
import { Calculator } from 'lucide-react';
import PxToRemCalculator from '../Calculator/Calculator';
import { SketchPicker } from 'react-color';

interface ModalProps {
  featureType: 'timer' | 'calculator';
}

const StatusBarModal: React.FC<ModalProps> = ({ featureType, setActiveModal, showModal, setShowModal }) => {
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const closeModal = () => {
    // Immediately hide modal before setting state
    if (modalRef.current) {
      modalRef.current.style.visibility = 'hidden';
    }
    setShowModal(false);
  };

  useOnClickOutside(modalRef, () => setShowModal(false));

  const [color, setColor] = useState('#fff');


  useEffect(() => {
    switch (featureType) {
      case 'timer':
        setModalContent(
          <div >
            <div className={styles.close}>
              <Icon id="close" size={16} onClick={closeModal}>Close</Icon>

            </div>
            <PomodoroTimer showModal={showModal}></PomodoroTimer>
          </div>
        );
        break;
      case 'calculator':
        setModalContent(
          <div >
            <div className={styles.close}>
              <Icon id="close" size={16} onClick={closeModal}>Close</Icon>

            </div>
            <PxToRemCalculator></PxToRemCalculator>
          </div>
        );
        break;
      case 'colorPicker':
        <SketchPicker
          color={color}
          onChangeComplete={newColor => setColor(newColor.hex)}
        />
        break;
      default:
        setModalContent(<div>Unknown Feature</div>);
    }
  }, [featureType]);

  return (
    <div style={{ visibility: showModal ? 'visible' : 'hidden' }} ref={modalRef}>
      <div className={styles.modal}>
        {modalContent}
      </div>
    </div>
  );
};

export default StatusBarModal;
