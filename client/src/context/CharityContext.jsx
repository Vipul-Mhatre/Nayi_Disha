import { createContext, useState } from "react";
const CharityContext = createContext();

export const StakingProvider = ({ children }) => {
    const [isReload, setIsReload] = useState(false);
    return (
        <CharityContext.Provider value={{ isReload, setIsReload }}>
            {children}
        </CharityContext.Provider>
    )
}

export default CharityContext;