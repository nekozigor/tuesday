import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import { createContext, useContext, useState } from "react";

type ErrorDialogContextType = {
    isErrorDialogOpen: boolean;
    setErrorMessage: (message: string) => void;
}

const  ErrorDialogContext = createContext<ErrorDialogContextType | undefined>(undefined);

export function ErrorDialogProvider({ children }: { children: React.ReactNode }) {
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessageState] = useState("");

    const setErrorMessage = (message: string) => {
        setErrorMessageState(message);
        setIsErrorDialogOpen(true);
    }

    return (
        <ErrorDialogContext.Provider value={{ isErrorDialogOpen, setErrorMessage }}>
            {children}
            <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Error!</DialogTitle>
                    </DialogHeader>
                    <Text>{errorMessage}</Text>
                </DialogContent>
            </Dialog>
        </ErrorDialogContext.Provider>
    );
}

export function useErrorDialog() {
    const ctx = useContext(ErrorDialogContext);
    if (!ctx) throw new Error("useErrorDialog must be used within an ErrorDialogProvider");
    return ctx;
}