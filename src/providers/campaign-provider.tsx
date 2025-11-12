"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type CampaignContextType = {
    selectedCampaignId: string;
    setSelectedCampaignId: (id: string) => void;
};

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export function CampaignProvider({ children }: { children: ReactNode }) {
    const [selectedCampaignId, setSelectedCampaignIdState] = useState<string>("the-aura");

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("selectedCampaignId");
        if (stored) {
            setSelectedCampaignIdState(stored);
        }
    }, []);

    const setSelectedCampaignId = (id: string) => {
        setSelectedCampaignIdState(id);
        localStorage.setItem("selectedCampaignId", id);
    };

    return (
        <CampaignContext.Provider value={{ selectedCampaignId, setSelectedCampaignId }}>
            {children}
        </CampaignContext.Provider>
    );
}

export function useCampaign() {
    const context = useContext(CampaignContext);
    if (context === undefined) {
        throw new Error("useCampaign must be used within a CampaignProvider");
    }
    return context;
}
