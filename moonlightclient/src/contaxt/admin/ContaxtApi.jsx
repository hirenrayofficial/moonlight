"use client";
import { createContext, useState, useContext } from "react"; // Use import instead of require

const modalContaxt = createContext();

export const ModalProvider = ({ children }) => {
  const [mopen, setOpen] = useState(false);

  const modalOpen = () => {
    setOpen(true);
  };

  // ✅ Wrap this in a function so it doesn't execute on render
  const modalClose = () => {
    setOpen(false);
  };

  return (
    <modalContaxt.Provider value={{ modalOpen, modalClose, mopen }}>
      {children}
    </modalContaxt.Provider>
  );
};

export const useModal = () => useContext(modalContaxt);