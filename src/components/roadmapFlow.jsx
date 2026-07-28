import ReactFlow, {
  Background,
  useEdgesState,
  useNodesState,
  MarkerType
} from "reactflow";

import "reactflow/dist/style.css";

// import {
//     ReactFlow,
//     Background,
//     // Controls,
//     useEdgesState,
//     useNodesState,
//     MarkerType,
//     Handle,
//     Position
// } from "@xyflow/react";

// import "@xyflow/react/dist/style.css";

import dagre from "@dagrejs/dagre";
import { useEffect, useState } from "react";

const nodeWidth = 200;
const nodeHeight = 80;


// // Custom Node Component with proper styling
// function RoadmapNode({ data }) {
//     return (
//         <div
//             style={{
//                 width: "100%",
//                 height: "100%",
//                 background: "white",
//                 border: "2px solid #160662",
//                 borderRadius: "14px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: "#160662",
//                 fontWeight: "600",
//                 fontSize: "18px",
//                 fontFamily: "'Inter',  sans-serif ",
//                 textAlign: "center",
//                 padding: "8px",
//                 boxShadow: "0 4px 15px rgba(22, 6, 98, 0.3)",
//             }}
//         >
//             <Handle type="target" position={Position.Top} isConnectable={false} />
//             {data.label}
//             <Handle type="source" position={Position.Bottom} isConnectable={false} />
//         </div>
//     );
// }

function getLayoutedElements(nodes, edges){

    const dagreGraph = new dagre.graphlib.Graph();

    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({
        rankdir: "TB",
        nodesep: 80,
        ranksep: 80,
        // marginx: 50,
        // marginy: 50
    });

    nodes.forEach(node => {
        dagreGraph.setNode(node.id , {
            width: nodeWidth,
            height: nodeHeight
        });
    });

    edges.forEach(edge => {
        dagreGraph.setEdge(
            edge.source,
            edge.target
        );
    }); 

    dagre.layout(dagreGraph);


    const layoutedNodes = nodes.map(node => {
        const position = dagreGraph.node(node.id);

        return {
            ...node,

            position: {
                x: position.x - nodeWidth/2 ,
                y: position.y - nodeHeight/2
            }, 
            
            style: {
                // width: nodeWidth, 
                // width: `${nodeWidth}px`,  // ← ADD UNITS
                // height: `${nodeHeight}px`, // ← ADD THIS
                background: "rgb(255, 255, 255)",
                border: "1.5px solid #160662",
                borderRadius: "14px",
                color: "#160662",
                fontWeight: "700",
                fontSize: "18px",
                fontFamily: "'Inter',  sans-serif ",
                padding: "10px",
                boxShadow: "0 0 20px #15066265",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                whiteSpace: "normal"
            },
            // type: "roadmapNode" 
        }; 
    });

    const start = Math.min(...layoutedNodes.map(node => node.position.y));
    const end = Math.max(...layoutedNodes.map(node => node.position.y));
    const actualHeight = (end-start) - 200;
    console.log(start);
    console.log(end);
    console.log(actualHeight);

    return {
        nodes: layoutedNodes, 
        edges, 
        height: actualHeight
    };
}

function RoadmapFlow({roadmap}){

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [flowHeight, setFlowHeight] = useState(600);

    // const nodeTypes = {
    //     roadmapNode: RoadmapNode
    // };


    useEffect(() => {
        if(!roadmap) return;

        const flowNodes = roadmap.nodes.map(node => ({
            id: node.id,
            data: { label: node.label},
            position: {x:0 , y:0},
            draggable: false
        }));

        const flowEdges = roadmap.edges.map((edge, index) => ({
            id: `edge-${index}`,

            source: edge.source,
            target: edge.target,
            // type: "smoothstep",
            type: "default",
            animated: true,
            style: {
                    stroke: "white",
                    strokeWidth: 2,
                },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "white"
            },
            // pathOptions: {
            //     // Helps reduce overlap visually
            //     offset: 50
            // }


        }));

        const layouted = getLayoutedElements(flowNodes, flowEdges);

        setNodes(layouted.nodes);
        setEdges(layouted.edges);
        setFlowHeight(Math.max(600, Math.min(layouted.height, 1200)));

    }, [roadmap, setNodes , setEdges]);

    return(
        <div
        style={{
            width: "100%",
            height: `${flowHeight}px`,
            // borderRadius: "20px",
            borderRadius: "12px",
            overflow: "hidden",
            // marginTop: "-30px",
            fontFamily: "'Inter',  sans-serif ",
            letterSpacing: "-0.05em",
            alignItems: "center",
            justifyContent: "center",

        }}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}

                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}

                fitView
                // fitViewOptions={{
                //     padding: 0.15,
                //     minZoom: 0.5,
                //     maxZoom: 1.5
                // }}

                nodesDraggable = {false}
                panOnDrag={false}
                // zoomOnScroll={false}
                preventScrolling ={false}
            >
                {/* <Controls /> */}
            </ReactFlow>
        </div>
    );


}

export default RoadmapFlow;