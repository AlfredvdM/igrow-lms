"use client";

import { createContext, useContext } from "react";

interface MobileMenuContextType {
    close: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextType | null>(null);

export const MobileMenuProvider = MobileMenuContext.Provider;

export const useMobileMenu = () => useContext(MobileMenuContext);
