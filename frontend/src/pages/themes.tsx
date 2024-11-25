import { ContentContainer, Loader } from "components/common";
import { Error } from "components/error";
import { useApi } from "hooks";
import { useEffect, useState } from "react";
import Graph from "react-vis-network-graph";
import "vis-network/styles/vis-network.css";

const Themes = () => {
    const api = useApi("/themes", { method: "GET" });
    const [nodes, setNodes] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            const data = await api.fetchData();
            const formattedNodes = data.map((theme: any) => ({
                id: theme._id,
                label: theme.name,
                title: `${theme.numberOfCards} cards`,
                size: theme.numberOfCards,
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
            zoomView: true,
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
                    select: ({ nodes }) => {
                        if (nodes.length > 0) {
                            // const tagId = nodes[0];
                            // needs discussion/thought since we do not have a generic /cards route
                            // navigate(`/cards?withTags=${tagId}`);
                        }
                    },
                }}
            />
        </div>
    );
};

export default Themes;
