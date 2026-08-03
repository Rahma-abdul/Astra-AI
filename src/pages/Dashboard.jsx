import "../styles/dashboard.css";
import { useState , useEffect } from "react";
import { supabase } from "../services/supabase";
import { useNavigate} from "react-router-dom";

import DashboardFlow from "../components/dashboardFlow";
import ActiveWS from "../components/activeWS";

function Dashboard(){

    const [activeWorkspaces, setActiveWorkspaces] = useState([]);
    const [username , setUsername] = useState("");

    // const addWorkspace = () => {

    //     const nextIndex = activeWorkspaces.length + 1;
    //     setActiveWorkspaces([...activeWorkspaces, `project${nextIndex}`]);
    // };

    const navigate = useNavigate();

    const handleNewWS = async () => {

        navigate(`/createWS`);
    }


    const loadDashboard = async () => {
    
    // Get logged in user
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        navigate("/login");
        return;
    }

        

    const [profileResult, workspaceResult] = await Promise.all([
        supabase
            .from("users")
            .select("username")
            .eq("id", user.id)
            .single(),

        supabase
            .from("workspaces")
            .select("*")
            .eq("user_id", user.id)
            .order("updated_at",{ascending:false})
    ]);


    setUsername(profileResult.data.username);
    setActiveWorkspaces(workspaceResult.data);
};


    useEffect(() => {
        loadDashboard();
    }, []);

    return(

        <div className="dashboard-page">
            {/* <div className="background-image"></div> */}
            <div className="section">
                <nav className="nav-section">
                    <div className="left-nav">
                        <img src="/icon2.png" className="profile-icon" />
                        <h1> Astra AI</h1>
                    </div>
                    <div className="right-nav">
                    <h1>hello {username}!! </h1>
                    {/* <img src="/icon2.png" className="profile-icon" /> */}
                    <div className="settings">
                        <img src="/icon14.png" className="settings-icon" />
                        <div className="dropdown-settings">
                            <a href="#">Change Username</a>
                            <a href="#">Delete Account</a>
                        </div>
                    </div>
                    </div>
                </nav>

                <div className="dashboard-section">
                    <div className="ws-section">
                        <div className="ws-container">
                            <h1 className="title-text2">Active Workspaces</h1>
                            {activeWorkspaces.length === 0 ? (
                                <div className="empty-state">
                                    <h1 className="reg-text2">No active workspaces yet.</h1>
                                    <div className="ghost">
                                        <img src="/icon17.png" className="ghost-icon" />
                                    </div>
                                    <p className="reg-text2">Click the + to create a workspace</p>
                                </div>
                            ) : (
                                activeWorkspaces.map((workspace) => (
                                    <ActiveWS key={workspace.id} workspace={workspace} />
                                ))
                            )}
                            <button type="button" className="add-ws" onClick={handleNewWS} disabled={activeWorkspaces.length>=2}>
                                <img src="/icon15.png" className="add-icon" alt="Add workspace" />
                            </button>
                            
                        </div>
                    </div>
                    <div className="about-section">
                        <div className="background-image"></div>
                        <div className="about1">
                        <div>
                        <h1 className="title-text2">Structured guidance <span className="title-text">from idea to deployment.</span> </h1>
                        <h1 className="reg-text">Astra AI is an AI-assisted project planning and execution platform that guides developers from an initial project idea to a complete implementation plan</h1>
                        <h1 className="reg-text">Modern software development requires dozens of interconnected decisions before implementation even begins.</h1>
                        {/* <h1 className="reg-text">DevPath AI helps you make the right ones before writing a single line of code.</h1> */}
                        </div>
                        <div className="decision-section">
                        <h1 className="title-text3">Developers constantly need to make decisions about: </h1>
                        <div className="decisions-cards">
                            {/* <div> */}
                            <h1 className="decision-card">Architecture</h1>
                            <h1 className="decision-card">Features</h1>
                            {/* </div> */}
                            {/* <div> */}
                            <h1 className="decision-card">Frameworks</h1>
                            <h1 className="decision-card">Deployment</h1>
                            {/* </div> */}
                            {/* <div> */}
                            <h1 className="decision-card">Databases</h1>
                            <h1 className="decision-card">Integration</h1>
                            {/* </div> */}
                        </div>
                        </div>
                        </div>
                        <div className="workflow">
                        <h1 className="title-text1">Workflow</h1>
                        <DashboardFlow/>
                        </div>
                        
                        


                    </div>
                </div>
            </div>
             
        </div>
    )

}

export default Dashboard;

// test