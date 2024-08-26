import { useDndMonitor } from "@dnd-kit/core";
import React from "react";

const DragOverlayWrapper = () => {
	useDndMonitor({
		onDragStart: (event) => {}
	})
    return <div>DrapOverlayWrapper</div>;
};

export default DragOverlayWrapper;
