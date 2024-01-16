//@ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import { useGlobalContext } from '../contexts/GlobalProvider';
import '../styles/styles.css';
import { CommandMenu } from './command-menu/command-menu-index';
import Editor from './editor/editor-index';
import PlaygroundPage from './playground/playground';
import StatusBar from './status-bar/statusBar-index';
import { Button } from './ui/button';


const App = () => {

  const [activeModal, setActiveModal] = useState<'timer' | 'calculator' | null>(null);
  const [showModal, setShowModal] = useState(false);

  const statusBarOptions = {
    activation: 'click', // or 'hover'
    deactivation: 'click', // or 'timeout'
  };

  return (
    <>
      <div className="max-h-[100vh] overflow-y-hidden">
        <DashboardTabs />
      </div>
      <CommandMenu />
      <StatusBar message="Example Message" options={statusBarOptions} setActiveModal={setActiveModal} showModal={showModal} setShowModal={setShowModal} />
    </>
  )
}

export default App;



function CustomTab() {
  return (
    <>
      <PlaygroundPage />
    </>)
}

function Tab3() {
  return (
    <>

      <Editor />
    </>


  )
}

function Tab4() {
  return (
    <iframe
      src="https://docs.google.com/document/d/e/2PACX-1vQOh48A7g_nxGC_rWT7veG9nILgM6x0B1cIsKsUk7L_bvqv4JZcGHT0pUbQnx86LzHylzhBAeeeZkAK/pub?embedded=true"
      style={{ width: '100%', height: '100vh', border: 'none' }}
    >
    </iframe>
  )
}

const TAB_CONFIG = {
  Default: {
    label: "App QA",
    component: <CustomTab />
  },
  Custom: {
    label: "Editor",
    component: <Tab3 />
  },

  Reference: {
    label: "Reference",
    component: <Tab3 />
  },
  Tab4: {
    label: "Reference",
    component: <Tab4 />
  }
};

function DashboardTabs() {
  const [activeTabKey, setActiveTabKey] = useState("Default");
  const [tabBlockLeft, setTabBlockLeft] = useState(0);
  const [tabBlockWidth, setTabBlockWidth] = useState(0);
  const tabsRef = useRef([]);

  useEffect(() => {
    const currentIdx = Object.keys(TAB_CONFIG).indexOf(activeTabKey);
    const currentTab = tabsRef.current[currentIdx];
    setTabBlockLeft(currentTab?.offsetLeft ?? 0);
    setTabBlockWidth(currentTab?.clientWidth ?? 0);
  }, [activeTabKey]);


  const { handleToggleSidebar } = useGlobalContext();

  return (
    <div className="relative w-full">
      <div className="relative flex items-center justify-between p-0 bg-muted">
        <span
          className="absolute bottom-0 left-0 px-2 transition-all duration-300 rounded-md shadow bg-primary-accent"
          style={{ left: tabBlockLeft, width: tabBlockWidth, top: '25%', bottom: '25%', backgroundColor: 'white' }}
        />
        <div data-step="Tabs" className="px-2 py-2 ml-2 rounded-md z-2 bg-muted">
          {Object.keys(TAB_CONFIG).map((key, idx) => (
            <button
              key={key}
              ref={(el) => (tabsRef.current[idx] = el)}
              className={`text-md font-normal px-4 py-2 transition-all duration-300 relative z-4 rounded-sm ${activeTabKey === key ? "text-primary-500" : "text-primary-500"
                }`}
              onClick={() => setActiveTabKey(key)}
            >
              {TAB_CONFIG[key].label}
            </button>
          ))}
        </div>
        <Button variant="ghost" onClick={handleToggleSidebar} >Yeah</Button>
      </div>
      <div>
        {Object.keys(TAB_CONFIG).map((key) => (
          <div key={key} style={{ display: activeTabKey === key ? "block" : "none" }}>
            {TAB_CONFIG[key].component}
          </div>
        ))}
      </div>
    </div>
  );
}

