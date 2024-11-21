import { Ban, ServerCrash } from "lucide-react";
import { useEffect, useState } from "react";
import { ErrorProps } from "types";

const Error = (props: ErrorProps) => {
    const [errorText, setErrorText] = useState("Unexpected error.");
    useEffect(() => {
        if (props?.errorType === "server-error") {
            setErrorText("Internal server error. Try again later!");
        } else if (props?.errorType === "data-not-found") {
            setErrorText("The data you wanted could not be fetched at the moment")
        }
    }, []);
    return (
        <div className="bg-neutral-300 p-16 rounded-md flex flex-col items-center">
            <div className="bg-neutral-100 p-4 rounded-full">
                { props?.errorType === "data-not-found" && <Ban size={36} className="text-neutral-700" />}
                { props?.errorType === "server-error" && <ServerCrash size={36} className="text-neutral-700" />}
            </div>
            <code className="text-lg text-neutral-700 mt-4 text-center">{errorText}</code>
        </div>
    )
}

export default Error;