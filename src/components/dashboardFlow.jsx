import ReactFlow, {
  Background,
  Controls,
  MarkerType,
} from "reactflow";

import "reactflow/dist/style.css";

const nodes = [
  {
    id: "1",
    position: {x:500 , y:-250},
    data: { label: "Describe Idea" },
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
    position: {x:100 , y:-200},
    data: {label: "Select Features"},
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
    position: {x:300 , y:-150},
    data: {label: "Logistics Determination"},
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
    position: {x:500 , y:-130},
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
    position: {x:700 , y:-110},
    data: {label: "Pick Tech Stack"},
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
    position: {x:900 , y:-90},
    data: {label: "WorkSpace Created"},
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
    position: {x:1000 , y: 10},
    data: {label: "Architecture Created"},
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
    position: {x:840 , y: 10},
    data: {label: "RoadMap Built"},
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
    position: {x:640 , y:10},
    data: {label: "Learning Resources"},
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
    id:"10",
    position: {x:440 , y:10},
    data: {label: "Deployment"},
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
    id:"11",
    position: {x:240 , y:10},
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

  {
    id:"12",
    position: {x:40 , y:10},
    data: {label: "Interview Prep"},
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
    stroke: "#9f8ff0",
    strokeWidth: 2,
  },
  },

  {
    id: "e2-3",
    source: "2",
    target: "3",
    animated: true,
    // markerEnd: {
    //   type: MarkerType.ArrowClosed,
    // },
    type: "smoothstep"
    , 
    style: {
    stroke: "#9f8ff0",
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
    stroke: "#9f8ff0",
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
    stroke: "#9f8ff0",
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
    stroke: "#9f8ff0",
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
    stroke: "#9f8ff0",
    strokeWidth: 2,
  },
  },

  {
    id: "e6-8",
    source: "6",
    target: "8",
    animated: true,
    // markerEnd: {
    //   type: MarkerType.ArrowClosed,
    // },
    type: "smoothstep"
    , 
    style: {
    stroke: "#9f8ff0",
    strokeWidth: 2,
  },
  },

  {
    id: "e6-9",
    source: "6",
    target: "9",
    animated: true,
    // markerEnd: {
    //   type: MarkerType.ArrowClosed,
    // },
    type: "smoothstep"
    , 
    style: {
    stroke: "#9f8ff0",
    strokeWidth: 2,
  },
  },
  {
    id: "e6-10",
    source: "6",
    target: "10",
    animated: true,
    // markerEnd: {
    //   type: MarkerType.ArrowClosed,
    // },
    type: "smoothstep"
    , 
    style: {
    stroke: "#9f8ff0",
    strokeWidth: 2,
  },
  },
  {
    id: "e6-11",
    source: "6",
    target: "11",
    animated: true,
    // markerEnd: {
    //   type: MarkerType.ArrowClosed,
    // },
    type: "smoothstep"
    , 
    style: {
    stroke: "#9f8ff0",
    strokeWidth: 2,
  },
  },
  {
    id: "e6-12",
    source: "6",
    target: "12",
    animated: true,
    // markerEnd: {
    //   type: MarkerType.ArrowClosed,
    // },
    type: "smoothstep"
    , 
    style: {
    stroke: "#9f8ff0",
    strokeWidth: 2,
  },
  },
];

function LandingFlow() {
  return (
    <div
      style={{
        width: "100%",
        height: "250px",
        borderRadius: "20px",
        overflow: "hidden",
        marginTop: "-30px",
        fontFamily: "'Inter',  sans-serif ",
        letterSpacing: "-0.05em",
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