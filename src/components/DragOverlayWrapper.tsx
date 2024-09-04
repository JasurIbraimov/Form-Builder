import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import React, { useState } from "react";
import { SidebarButtonElementDragOverlay } from "./SidebarButtonElement";
import { ElementsType, FormElements } from "./FormElements";
import useDesigner from "./hooks/useDesigner";

const DragOverlayWrapper = () => {
    const { elements } = useDesigner();
    const [draggedItem, setDraggedItem] = useState<Active | null>(null);
    useDndMonitor({
        onDragStart(event) {
            setDraggedItem(event.active);
        },
        onDragCancel(event) {
            setDraggedItem(null);
        },
        onDragEnd(event) {
            setDraggedItem(null);
        },
    });
    let node = <div>no drag overlay</div>;
    const isSidebarButtonElement =
        draggedItem?.data.current?.isDesignerButtonElement;

    const isDesignerElement = draggedItem?.data.current?.isDesignerElement;

    if (isDesignerElement) {
        const elementId = draggedItem?.data?.current?.elementId;
        const element = elements.find((el) => el.id === elementId);
        if (!element) node = <div>ELement not found</div>;
        else {
            const DesignerElementComponent =
                FormElements[element.type].designerComponent;
            node = <div className="flex bg-accent border rounded-md h-[120px] w-full py-2 px-4 opacity-80 pointer pointer-events-none">
                <DesignerElementComponent elementInstance={element} />
            </div>;
        }
    }
    if (isSidebarButtonElement) {
        const type = draggedItem?.data?.current?.type as ElementsType;
        node = (
            <SidebarButtonElementDragOverlay formElement={FormElements[type]} />
        );
    }
    return <DragOverlay>{node}</DragOverlay>;
};

export default DragOverlayWrapper;
