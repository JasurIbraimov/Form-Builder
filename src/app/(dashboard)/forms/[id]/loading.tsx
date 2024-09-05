import React from "react";
import { ImSpinner2 } from "react-icons/im";

const LoadingPage = () => {
    return (
        <div className="flex items-center justify-center w-full flex-grow">
            <ImSpinner2 className="animate-spin w-12 h-12 text-primary" />
        </div>
    );
};

export default LoadingPage;
