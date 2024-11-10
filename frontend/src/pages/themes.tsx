import { useApi } from "hooks";
import { useEffect } from "react";

const Themes = () => {
    const api = useApi("/themes", { method: "GET" });
    const fetchData = async () => {
        await api.fetchData();
    }
    useEffect(() => {
        fetchData();
    },[])
    return (
        <div>
            {/* use api.data */}
        </div>
    )
}

export default Themes;