import "../styles/dashboard.css";
import { useState , useEffect } from "react";
import { supabase } from "../services/supabase";
import { useNavigate} from "react-router-dom";

import DashboardFlow from "../components/dashboardFlow";
import ActiveWS from "../components/activeWS";

function Dashboard(){

    const [activeWorkspaces, setActiveWorkspaces] = useState([]);
    const [username , setUsername] = useState("");
    const [numActiveProj , setNumActiveProj] = useState(0);

    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [newUsername, setNewUsername] = useState("");

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
            .select("username , active_proj")
            .eq("id", user.id)
            .single(),

        supabase
            .from("workspaces")
            .select("*")
            .eq("user_id", user.id)
            .order("updated_at",{ascending:false})
    ]);


    if (profileResult.error) {
        console.error(profileResult.error);
        return;
    }

    if (workspaceResult.error) {
        console.error(workspaceResult.error);
        return;
    }

    setUsername(profileResult.data.username);
    setActiveWorkspaces(workspaceResult.data);
    setNumActiveProj(profileResult.data.active_proj);
};


    useEffect(() => {
        loadDashboard();
    }, []);

    const handleLogout = async() => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Logout failed:", error);
            return;
        }

        navigate("/");
    };

    const handleChangeUsername = async () => {

    const username = newUsername.trim();
     if (!username) {
        alert("Fill with your new username or click cancel!!");
        return;
    }

    if (username.length > 30) {
        alert("Username must be 30 characters or less!!");
        return;
    }

    const { data: { user }, error: userError } =
        await supabase.auth.getUser();

    if (userError || !user) {
        console.error(userError);
        return;
    }

    const { error } = await supabase
        .from("users")
        .update({
            username: username
        })
        .eq("id", user.id);

    if (error) {
        console.error("Failed to change username:", error);
        return;
    }

    setUsername(username);
    setShowUsernameModal(false);
    setNewUsername("");
};

    const handleDelete = async() => {

    const confirmed = window.confirm(
        "Are you sure you want to delete your account?\n\n" +
        "This will permanently delete your account and all of your workspaces.\n\n" +
        "This action cannot be undone."
    );

    if (!confirmed) {
        return;
    }

    try {

        const {
            data: { session },
            error: sessionError
        } = await supabase.auth.getSession();

        if (sessionError || !session?.access_token) {
            throw new Error("Not authenticated");
        }

        const response = await fetch("/api/updateWorkspace-api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`
            },
            body: JSON.stringify({
                action: "deleteAccount"
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(data.error);
            alert(data.error || "Failed to delete account.");
            return;
        }

        // Sign out locally
        await supabase.auth.signOut();

        navigate("/");

    } catch (error) {

        console.error("Delete account failed:", error);

        alert("Something went wrong while deleting your account.");
    }
    };


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
                        <img src="/icon26.png" className="settings-icon" />
                        <div className="dropdown-settings">
                            <button className="dropdown-button" onClick={() => setShowUsernameModal(true)}>Change Username</button>
                            <button className="dropdown-button" onClick={handleLogout}>Log Out</button>
                            <button className="dropdown-button" onClick={handleDelete}>Delete Account</button>
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
                            <button type="button" className="add-ws" onClick={handleNewWS} disabled={activeWorkspaces.length>=2 && numActiveProj >= 2}>
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
                            </div>
                            <div className="decision-section">
                                <h1 className="title-text3">Developers constantly need to make decisions about: </h1>
                                <div className="decisions-cards">
                                    <h1 className="decision-card">Architecture</h1>
                                    <h1 className="decision-card">Features</h1>
                                    <h1 className="decision-card">Frameworks</h1>
                                    <h1 className="decision-card">Deployment</h1>
                                    <h1 className="decision-card">Databases</h1>
                                    <h1 className="decision-card">Integration</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="workflow">
                        <h1 className="title-text1">Workflow</h1>
                        <DashboardFlow/>
                </div>
            </div>
                    {showUsernameModal && (
                <div className="modal-overlay">
                    <div className="username-modal">

                        <h2>Change Username</h2>

                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            placeholder="New username"
                        />

                        <div className="modal-buttons">
                            <button className= "cancel-btn" onClick={() => setShowUsernameModal(false)}>
                                Cancel
                            </button>

                            <button onClick={handleChangeUsername}>
                                Save
                            </button>
                        </div>

                    </div>

            </div>
        )}  
        </div>
    )

}

export default Dashboard;

// test