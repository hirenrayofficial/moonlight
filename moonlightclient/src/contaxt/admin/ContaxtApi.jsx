"use client";
const { createContext, Children, useState, useContext } = require("react");

const modalContaxt = createContext();

export const ModalProvider = ({ children }) => {
  const [mopen, setOpen] = useState(false);

  const modalOpen = () => {
    alert("hii")
    setOpen(true);
  };
  const modalClose = setOpen(false);

  return (
    <modalContaxt.Provider value={{ modalOpen, modalClose, mopen }}>
      {children}
    </modalContaxt.Provider>
  );
};

export const useModal = () => useContext(modalContaxt);
