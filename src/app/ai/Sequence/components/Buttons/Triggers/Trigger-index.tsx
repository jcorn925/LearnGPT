
import Icon from '@src/components/IconWrapper/Icon'
import styles from './Trigger.module.scss'
import React, { useState } from 'react'


export default function Trigger({ currentNodeTopic, setTriggered, setInitTrigger }) {

  return (
    <div>
      <div className={styles['Trigger__wrapper']} onClick={() => { setTriggered(true); setInitTrigger(true) }}>
        <Icon id="search" size={16} color="grey" />
        <span>Explore Ideas related to : {currentNodeTopic}</span>
      </div>

    </div>
  )

}