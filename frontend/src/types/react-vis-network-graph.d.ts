declare module 'react-vis-network-graph' {
    import { FC } from 'react';

    type GraphData = {
        nodes: Array<{
            id: number | string;
            label?: string;
            title?: string;
            color?: string;
            size?: number;
        }>;
        edges: Array<{
            from: number | string;
            to: number | string;
        }>;
    };

    type GraphOptions = Record<string, any>;

    type GraphEvents = {
        select?: (event: { nodes: any[]; edges: any[] }) => void;
    };

    type GraphProps = {
        graph: GraphData;
        options?: GraphOptions;
        events?: GraphEvents;
        style?: React.CSSProperties;
    };

    const Graph: FC<GraphProps>;
    export default Graph;
}
