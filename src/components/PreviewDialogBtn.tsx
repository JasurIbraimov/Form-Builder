import React from "react";
import { Button } from "./ui/button";
import { LuEye } from "react-icons/lu";

const PreviewDialogBtn = () => {
    return (
        <Button value="outline" className="gap-2">
            <LuEye className="h-6 w-6" /> Preview
        </Button>
    );
};

export default PreviewDialogBtn;
