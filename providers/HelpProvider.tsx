import { createContext, useContext, useState } from "react";

type HelpContextType = {
    isHelpCalled: boolean;
    setIsHelpCalled: (value: boolean) => void;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export function HelpProvider({ children }: { children: React.ReactNode }) {
    const [isHelpCalled, setIsHelpCalled] = useState(false);

    return (
        <HelpContext.Provider value={{ isHelpCalled, setIsHelpCalled }}>
            {children}
        </HelpContext.Provider>
    );
}

export function useHelp() {
    const ctx = useContext(HelpContext);
    if (!ctx) throw new Error("useHelp must be used within a HelpProvider");
    return ctx;
}   