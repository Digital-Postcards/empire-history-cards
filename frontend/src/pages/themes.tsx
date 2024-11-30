import { ContentContainer, Loader } from "components/common";
import { Error } from "components/error";
import { useApi } from "hooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Graph from "react-vis-network-graph";
import "vis-network/styles/vis-network.css";

const Themes = () => {
    const navigate = useNavigate();
    const api = useApi("/themes", { method: "GET" });
    const [nodes, setNodes] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            const data = await api.fetchData();
            const maxCards = Math.max(...data.map((theme: any) => theme.numberOfCards));
            const minCards = Math.min(...data.map((theme: any) => theme.numberOfCards));
            const range = maxCards - minCards || 1; // Avoid division by zero
            const formattedNodes = data.map((theme: any) => ({
                id: theme._id,
                label: theme.name,
                title: `${theme.numberOfCards} cards`,
                size: ((theme.numberOfCards - minCards) / range) * 50 + 8,
                color: "#D2B48C",
            }));
            setNodes(formattedNodes);
        } catch (error) {
            console.error("Error fetching themes:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const graphData = {
        nodes: nodes,
        edges: [],
    };

    const graphOptions = {
        layout: {
            hierarchical: false,
        },
        physics: {
            enabled: true,
        },
        interaction: {
            dragNodes: true,
            zoomView: false,
            dragView: true,
        },
        nodes: {
            shape: "dot",
            font: {
                size: 15,
                color: "black",
            },
        },
    };

    if (api.isLoading) return <Loader isFullSize />;

    if (api.error)
        return (
            <ContentContainer>
                <Error errorType="server-error" />
            </ContentContainer>
        );

    return (
        <div className="h-[100vh] w-[100vw]">
            <Graph
                graph={graphData}
                options={graphOptions}
                events={{
                    select: (event: any) => {
                        if (event.nodes.length > 0) {
                            const requiredNode: any = nodes.filter((node: any) => node.id === event.nodes[0]);
                            console.log(requiredNode);
                            navigate(`/cards?withTags=${requiredNode[0].label}`);
                        }
                    },
                }}
            />
        </div>
    );
};

export default Themes;
