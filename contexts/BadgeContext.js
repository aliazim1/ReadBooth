import { createContext, useContext, useState } from "react";

const BadgeContext = createContext();

export const BadgeProvider = ({ children }) => {
  const [badgeCount, setBadgeCount] = useState(0);
  return (
    <BadgeContext.Provider value={{ badgeCount, setBadgeCount }}>
      {children}
    </BadgeContext.Provider>
  );
};

export const useTabBadge = () => useContext(BadgeContext);
