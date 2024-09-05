"use client";

import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useState,
} from "react";
import { FormElementInstance } from "../FormElements";

type DesignerContextType = {
    elements: FormElementInstance[];
    addElement: (index: number, element: FormElementInstance) => void;
    removeElement: (id: string) => void;
    updateElement: (id: string, element: FormElementInstance) => void;
    selectedElement: FormElementInstance | null;
    setSelectedElement: Dispatch<SetStateAction<FormElementInstance | null>>;
};

export const DesignerContext = createContext<DesignerContextType | null>(null);

export default function DesignerContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [selectedElement, setSelectedElement] =
        useState<FormElementInstance | null>(null);
    const [elements, setElements] = useState<FormElementInstance[]>([]);
    const addElement = (index: number, element: FormElementInstance) => {
        setElements((prev) => {
            const newElements = [...prev];
            newElements.splice(index, 0, element);
            return newElements;
        });
    };
    const updateElement = (id: string, element: FormElementInstance) => {
        setElements((prev) => {
            const prevElementIndex = prev.findIndex((el) => el.id === id);
            const newElements = [...prev];
            newElements[prevElementIndex] = element;
            return newElements;
        });
    };
    const removeElement = (id: string) => {
        setElements((prev) => prev.filter((element) => element.id !== id));
    };

    return (
        <DesignerContext.Provider
            value={{
                selectedElement,
                setSelectedElement,
                elements,
                addElement,
                removeElement,
                updateElement,
            }}
        >
            {children}
        </DesignerContext.Provider>
    );
}
