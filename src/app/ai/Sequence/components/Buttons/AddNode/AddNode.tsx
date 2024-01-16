import React from 'react';
import styles from './AddNode.module.scss';
import Icon from '@src/components/IconWrapper/Icon';

export default function AddNode({ handleAddNode }) {


  return (
    <div onClick={handleAddNode} className={styles['AddNode__container']}>
        <Icon id="plus" size={32} color="grey" />
    </div>
  )


}