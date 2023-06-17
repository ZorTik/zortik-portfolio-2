import {createContext, PropsWithChildren, useContext, useState} from "react";

export type DropdownContextProps = {
    dropdownShown: string,
    setDropdownShown: (dropdown: string) => void,
}

const DropdownContext = createContext<DropdownContextProps>({dropdownShown: "", setDropdownShown: () => {}});

export function DropdownContextProvider({children}: PropsWithChildren) {
    const [dropdownShown, setDropdownShown] = useState<string>("");
    return <DropdownContext.Provider value={{dropdownShown, setDropdownShown}}>{children}</DropdownContext.Provider>
}

export function useDropdowns() {
    return useContext<DropdownContextProps>(DropdownContext);
}
