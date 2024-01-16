import React, { useRef, useState } from "react";
import styles from './ControlBar.module.scss'
import Icon from "@src/components/IconWrapper/Icon";
import RippleButton from "@src/components/Buttons/RippleButton/rippleButton-index";

const TreeControlBar = ({
  inverted,
  printInfo,
  setInverted,
  depthFactor,
  setDepthFactor,
  siblingSeperation,
  saveTreeDataToFile,
  setSiblingSeperation,
  loadTreeDataFromFile,
}) => {
  const [isExtended, setIsExtended] = useState(false);
  const fileInputRef = useRef();

  const onFileIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const toggleExtend = () => {
    setIsExtended(!isExtended);
  }

  return (
    <>
      <div className={`${styles['TreeBar__wrapper']} ${isExtended ? styles['extended'] : ''}`}>
        <div className={styles['TreeBar__container']}>

          <RippleButton callBack={toggleExtend} padding="4px">
            <Icon id={"expandLeft"} size={24} />
          </RippleButton>

          {isExtended && (
            <>
              {/* Your extended controls */}
              <label>Depth</label>
              <br></br>
              <input
                type="range"
                min="400"
                max="1500"
                step="100"
                value={depthFactor}
                onChange={(e) => setDepthFactor(Number(e.target.value))}
              />

              <input
                type="file"
                accept=".json"
                onChange={loadTreeDataFromFile}
                className={styles['hiddenInput']}
                ref={fileInputRef}
              />

              <RippleButton padding="12px" callBack={onFileIconClick}>
                <Icon id="upload" size={16} />
              </RippleButton>
              <div className={styles['verticalDivider']}></div>
              <RippleButton callBack={() => { saveTreeDataToFile(true) }} padding="12px">
                <Icon id="save" size={16} />
              </RippleButton>
              <div className={styles['verticalDivider']}></div>

              <RippleButton callBack={() => { setInverted(!inverted) }} padding="12px">
                <Icon id="invert" size={16} />
              </RippleButton>
              <label>Seperation</label>
              <br></br>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={siblingSeperation}
                onChange={(e) => setSiblingSeperation(Number(e.target.value))}
              />
            </>
          )}

        </div>
      </div>
    </>

  );
};

export default TreeControlBar;
