import { useState } from "react";
import { useNavigate} from "react-router-dom";

function ActiveWS({ workspace }) {

  const ws_name = workspace.ws_name;
  const percent = workspace.status?.percentage;
  const tasks = workspace.status?.doneTasks?.length ?? 0;
  const timeline = new Date(workspace.updated_at).toLocaleString();
  
  const navigate = useNavigate();

    const openWorkspace = () => {
        navigate(`/WS/${workspace.id}`);
    };

  return (
    <div className="active-ws-card" onClick={openWorkspace}>
        <h1 className="ws-title">{ws_name}</h1>
        <h1 className="details">{percent}% Complete</h1>
        <h1 className="details">{tasks} Tasks Completed</h1>
        <h1 className="details">Last updated: {timeline}</h1>

    </div>
  );
}
export default ActiveWS;
