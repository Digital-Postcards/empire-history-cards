import { useApi } from "hooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Graph from "react-vis-network-graph";
import "vis-network/styles/vis-network.css";

const Themes = () => {
  const api = useApi("/themes", { method: "GET" });
  const [nodes, setNodes] = useState<any[]>([]);
  const navigate = useNavigate(); 

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

  return (
    <div>
      <div style={{ height: "500px" }}>
        {nodes.length > 0 ? (
          <Graph
            graph={graphData}
            options={graphOptions}
            events={{
              select: ({ nodes }) => {
                if (nodes.length > 0) {
                  const tagId = nodes[0];
                  navigate(`/cards?tagId=${tagId}`);
                }
              },
            }}
          />
        ) : (
          <p>Loading tags...</p>
        )}
      </div>
    </div>
  );
};

export default Themes;

