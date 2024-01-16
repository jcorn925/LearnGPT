import React, { useState, ChangeEvent } from 'react';
import styles from './Calculator.module.scss'
import Icon from '@src/components/IconWrapper/Icon';
const PxToRemCalculator: React.FC = () => {
  const [px, setPx] = useState<number>(0);
  const [rem, setRem] = useState<number>(0);

  const handlePxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const pxValue = parseInt(e.target.value);
    setPx(pxValue);
    setRem(pxValue / 16);
  }

  return (
    <div className={styles.container}>
      <div className= {styles['text2']} htmlFor="px-input">Px to Rem</div>
      <div className={styles['converter']}>
        <div className={styles['PX__container']} >
          <input className={styles['input']} id="px-input"  value={px} onChange={handlePxChange} />
          <div className={styles['PX']}>px</div>
        </div>
        <Icon id="switch" size={16} color="grey"></Icon>
        <div>
          <div className={styles['text']}>{rem.toFixed(2)}rem</div>
        </div>
      </div>

    </div>
  );
};

export default PxToRemCalculator;
