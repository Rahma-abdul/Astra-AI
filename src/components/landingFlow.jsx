import ReactFlow, {
  Background,
  Controls,
  MarkerType,
} from "reactflow";

import "reactflow/dist/style.css";

const nodes = [
  {
    id: "1",
    position: { x: 80, y: -50 },
    data: { label: "Project Idea" },
    draggable: false,
    style: {
      background: "rgba(255,255,255,0.8)",
      border: "1.5px solid #160662",
      borderRadius: "14px",
      color: "#160662",
      fontWeight: "600",
      padding: "10px",
      boxShadow: "0 0 20px #15066265"
    }
  },

  {
    id:"2",
    position: {x:300 , y:-150},
    data: {label: "Feature Selection"},
    draggable: false,
    style: {
      background: "rgba(255,255,255,0.8)",
      border: "1.5px solid #160662",
      borderRadius: "14px",
      color: "#160662",
      fontWeight: "600",
      padding: "10px",
      boxShadow: "0 0 20px #15066265"
    }
  },

  {
    id:"3",
    position: {x:300 , y:50},
    data: {label: "Stack Selection"},
    draggable: false,
    style: {
      background: "rgba(255,255,255,0.8)",
      border: "1.5px solid #160662",
      borderRadius: "14px",
      color: "#160662",
      fontWeight: "600",
      padding: "10px",
      boxShadow: "0 0 20px #15066265"
    }
  },

  {
    id:"4",
    position: {x:600 , y:-50},
    data: {label: "Feasibility Analysis"},
    draggable: false,
    style: {
      background: "rgba(255,255,255,0.8)",
      border: "1.5px solid #160662",
      borderRadius: "14px",
      color: "#160662",
      fontWeight: "600",
      padding: "10px",
      boxShadow: "0 0 20px #15066265"
    }
  },

  {
    id:"5",
    position: {x:900 , y:-50},
    data: {label: "Architecture"},
    draggable: false,
    style: {
      background: "rgba(255,255,255,0.8)",
      border: "1.5px solid #160662",
      borderRadius: "14px",
      color: "#160662",
      fontWeight: "600",
      padding: "10px",
      boxShadow: "0 0 20px #15066265"
    }
  },

  {
    id:"6",
    position: {x:950 , y:150},
    data: {label: "Roadmap"},
    draggable: false,
    style: {
      background: "rgba(255,255,255,0.8)",
      border: "1.5px solid #160662",
      borderRadius: "14px",
      color: "#160662",
      fontWeight: "600",
      padding: "10px",
      boxShadow: "0 0 20px #15066265"
    }
  },

  {
    id:"7",
    position: {x:650 , y:150},
    data: {label: "Workspace"},
    draggable: false,
    style: {
      background: "rgba(255,255,255,0.8)",
      border: "1.5px solid #160662",
      borderRadius: "14px",
      color: "#160662",
      fontWeight: "600",
      padding: "10px",
      boxShadow: "0 0 20px #15066265"
    }
  },

  {
    id:"8",
    position: {x:350 , y:150},
    data: {label: "Build & Deploy"},
    draggable: false,
    style: {
      background: "rgba(255,255,255,0.8)",
      border: "1.5px solid #160662",
      borderRadius: "14px",
      color: "#160662",
      fontWeight: "600",
      padding: "10px",
      boxShadow: "0 0 20px #15066265"
    }
  },

  {
    id:"9",
    position: {x:100 , y:150},
    data: {label: "Documentation"},
    draggable: false,
    style: {
      background: "rgba(255,255,255,0.8)",
      border: "1.5px solid #160662",
      borderRadius: "14px",
      color: "#160662",
      fontWeight: "600",
      padding: "10px",
      boxShadow: "0 0 20px #15066265"
    }
  },


];

const edges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    type: "smoothstep",
    // markerEnd: {
    //   type: MarkerType.ArrowClosed,
    // },
    style: {
    stroke: "#160662",
    strokeWidth: 2,
  },
  },

  {
    id: "e1-3",
    source: "1",
    target: "3",
    animated: true,
    // markerEnd: {
    //   type: MarkerType.ArrowClosed,
    // },
    type: "smoothstep"
    , 
    style: {
    stroke: "#160662",
    strokeWidth: 2,
  },
  },

  {
    id: "e2-4",
    source: "2",
    target: "4",
    animated: true,
    // markerEnd: {
    //   type: MarkerType.ArrowClosed,
    // },
     type: "smoothstep"
     , 
    style: {
    stroke: "#160662",
    strokeWidth: 2,
  },
  },

  {
    id: "e3-4",
    source: "3",
    target: "4",
    animated: true,
    // markerEnd: {
    //   type: MarkerType.ArrowClosed,
    // },
    type: "smoothstep"
    , 
    style: {
    stroke: "#160662",
    strokeWidth: 2,
  },
  },

  {
    id: "e4-5",
    source: "4",
    target: "5",
    animated: true,
    // markerEnd: {
    //   type: MarkerType.ArrowClosed,
    // },
    type: "smoothstep"
    , 
    style: {
    stroke: "#160662",
    strokeWidth: 2,
  },
  },
  {
    id: "e5-6",
    source: "5",
    target: "6",
    animated: true,
    // markerEnd: {
    //   type: MarkerType.ArrowClosed,
    // },
    type: "smoothstep"
    , 
    style: {
    stroke: "#160662",
    strokeWidth: 2,
  },
  },

  {
    id: "e6-7",
    source: "6",
    target: "7",
    animated: true,
    // markerEnd: {
    //   type: MarkerType.ArrowClosed,
    // },
    type: "smoothstep"
    , 
    style: {
    stroke: "#160662",
    strokeWidth: 2,
  },
  },

  {
    id: "e7-8",
    source: "7",
    target: "8",
    animated: true,
    // markerEnd: {
    //   type: MarkerType.ArrowClosed,
    // },
    type: "smoothstep"
    , 
    style: {
    stroke: "#160662",
    strokeWidth: 2,
  },
  },
  {
    id: "e8-9",
    source: "8",
    target: "9",
    animated: true,
    // markerEnd: {
    //   type: MarkerType.ArrowClosed,
    // },
    type: "smoothstep"
    , 
    style: {
    stroke: "#160662",
    strokeWidth: 2,
  },
  },
];

function LandingFlow() {
  return (
    <div
      style={{
        width: "100%",
        height: "450px",
        // borderRadius: "240px",
        overflow: "hidden",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        zoomOnScroll={false}
        panOnDrag={false}
        nodesDraggable={false}
        preventScrolling ={false}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default LandingFlow;