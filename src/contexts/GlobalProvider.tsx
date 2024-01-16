import React, { createContext, useContext, useState, useEffect } from "react";

const GlobalContext = createContext<GlobalContextProps>({} as GlobalContextProps);

interface GlobalContextProps {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  isSidebarOpen: boolean;
  handleToggleSidebar: () => void;
  docId: string;
  setDocId: React.Dispatch<React.SetStateAction<string>>;
  docLink: string;
  setDocLink: React.Dispatch<React.SetStateAction<string>>;
  handleDocLinkChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLoadDoc: () => void;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  clearImages: () => void;
  refreshDashBoardTrigger: number;
  setRefreshDashBoardTrigger: React.Dispatch<React.SetStateAction<number>>;
  loadNewDoc: (newDocId: string) => void;
}

export function GlobalProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [docLink, setDocLink] = useState('');
  const [docId, setDocId] = useState( );
  const [images, setImages] = useState([]);
  const [refreshDashBoardTrigger, setRefreshDashBoardTrigger] = useState(0);



  const handleToggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const clearImages = () => {
    setImages([]);
  };

  const handleDocLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocLink(e.target.value);
  };

  const handleLoadDoc = () => {
    const match = docLink.match(/https:\/\/docs\.google\.com\/document\/d\/(.*?)\//);
    if (match && match[1]) {
        setDocId(match[1]);
    } else {
        alert("Invalid Google Docs link");
    }
  };

  const loadNewDoc = (newDocId: string) => {
    setDocId(newDocId);
  };

  const ctx: GlobalContextProps = {
    theme,
    setTheme,
    isSidebarOpen,
    handleToggleSidebar,
    docId,
    setDocId,
    docLink,
    setDocLink,
    handleDocLinkChange,
    handleLoadDoc,
    images,
    setImages,
    clearImages,
    refreshDashBoardTrigger,
    setRefreshDashBoardTrigger,
    loadNewDoc
  };

  return <GlobalContext.Provider value={ctx}>{children}</GlobalContext.Provider>;
}

export function useGlobalContext() {
  return useContext(GlobalContext);
}
