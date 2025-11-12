import React, { createContext, useContext, useState } from 'react'

const ToastContext = createContext();

export default function ToastProvider({ children }) {
  const [msg, setMsg] = useState(null);

  function show(message) {
    setMsg(message);
    setTimeout(() => setMsg(null), 3500);
  }

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {msg && <div className="toast">{msg}</div>}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
