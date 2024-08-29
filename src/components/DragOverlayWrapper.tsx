import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import React, { useState } from "react";
import { SidebarButtonElementDragOverlay } from "./SidebarButtonElement";
import { ElementsType, FormElements } from "./FormElements";

const DragOverlayWrapper = () => {
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

    if (isSidebarButtonElement) {
        const type = draggedItem?.data?.current?.type as ElementsType;
        node = (
            <SidebarButtonElementDragOverlay formElement={FormElements[type]} />
        );
    }
    return <DragOverlay>{node}</DragOverlay>;
};

export default DragOverlayWrapper;
