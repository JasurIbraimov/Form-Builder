import React from "react";
import { LuSave } from "react-icons/lu";
import { Button } from "./ui/button";

const SaveFormBtn = () => {
    return (
        <Button value="outline" className="gap-2">
            <LuSave className="h-6 w-6" /> Save
        </Button>
    );
};

export default SaveFormBtn;
