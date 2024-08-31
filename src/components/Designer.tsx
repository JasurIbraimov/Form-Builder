"use client";
import React, { useState } from "react";
import DesignerSidebar from "./DesignerSidebar";
import { useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import {
    ElementsType,
    FormElementInstance,
    FormElements,
} from "./FormElements";
import useDesigner from "./hooks/useDesigner";
import { idGenerator } from "@/lib/idGenerator";
import { Button } from "./ui/button";
import { LuTrash } from "react-icons/lu";

const Designer = () => {
    const { elements, addElement } = useDesigner();

    const droppable = useDroppable({
        id: "designer-drop-area",
        data: {
            isDesignerDropArea: true,
        },
    });

    useDndMonitor({
        onDragEnd(event) {
            const { active, over } = event;
            if (!active || !over) return;

            const isDesignerButtonElement =
                active.data?.current?.isDesignerButtonElement;
            if (isDesignerButtonElement) {
                const type = active.data?.current?.type;
                const newElement = FormElements[type as ElementsType].construct(
                    idGenerator()
                );

                addElement(0, newElement);
            }
        },
    });

    return (
        <div className="flex w-full h-full">
            <div className="p-4 w-full">
                <div
                    ref={droppable.setNodeRef}
                    className={cn(
                        "bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto",
                        droppable.isOver && "ring-primary ring-2"
                    )}
                >
                    {!droppable.isOver && elements.length === 0 && (
                        <p className="text-3xl text-muted-foreground flex flex-grow items-center font-bold">
                            Drag & Drop here
                        </p>
                    )}
                    {droppable.isOver && (
                        <div className="p-4 w-full">
                            <div className="h-[100px] rounded-md bg-primary opacity-50"></div>
                        </div>
                    )}

                    {elements.length > 0 && (
                        <div className="flex flex-col gap-2 w-full p-4">
                            {elements.map((element) => (
                                <DesignerElementWrapper
                                    key={element.id}
                                    element={element}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <DesignerSidebar />
        </div>
    );
};

function DesignerElementWrapper({ element }: { element: FormElementInstance }) {
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const { removeElement } = useDesigner();
    const topHalf = useDroppable({
        id: element.id + "-top",
        data: {
            type: element.type,
            elementId: element.id,
            isTopHalfDesignerElement: true,
        },
    });

    const bottomHalf = useDroppable({
        id: element.id + "-bottom",
        data: {
            type: element.type,
            elementId: element.id,
            isBottomHalfDesignerElement: true,
        },
    });
    const draggable = useDraggable({
        id: element.id + "-drag-handler",
        data: {
            type: element.type,
            elementId: element.id,
            isDesignerElement: true,
        },
    });
    const DesignerElement = FormElements[element.type].designerComponent;
    return (
        <div
            {...draggable.listeners}
            ref={draggable.setNodeRef}
            onMouseEnter={() => setMouseIsOver(true)}
            onMouseLeave={() => setMouseIsOver(false)}
            className="relative h-[120px] flex flex-col text-foreground hover:cursor-pointer ring-1 ring-inset ring-accent rounded-md"
        >
            <div
                ref={topHalf.setNodeRef}
                className={cn(
                    "absolute top-0 w-full h-1/2 rounded-t-md",
                    topHalf.isOver && "bg-green-500"
                )}
            ></div>
            <div
                ref={bottomHalf.setNodeRef}
                className={cn(
                    "absolute w-full bottom-0 h-1/2 rounded-b-md",
                    bottomHalf.isOver && "bg-red-500"
                )}
            ></div>
            {mouseIsOver && (
                <>
                    <div className="absolute right-0 h-full">
                        <Button
                            onClick={() => removeElement(element.id)}
                            variant={"outline"}
                            className="flex justify-center h-full border rounded-md rounded-l-none bg-destructive"
                        >
                            <LuTrash className="h-6 w-6" />
                        </Button>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
                        <p className="text-muted-foreground text-sm">
                            Click for properties or drag to move
                        </p>
                    </div>
                </>
            )}
            <div
                className={cn(
                    "flex w-full h-[120px] opacity-100 items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none",
                    mouseIsOver && "opacity-30"
                )}
            >
                <DesignerElement elementInstance={element} />
            </div>
        </div>
    );
}

export default Designer;

// 1:46:48
