import "../styles/ws.css";
import { useState , useEffect} from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
// import DashboardFlow from "../components/dashboardFlow";
import RoadmapFlow from "../components/roadmapFlow";
import DocsCard from "../components/docsCard";
import { supabase } from "../services/supabase";



function Workspace(){

    const { id } = useParams();

    const location = useLocation();
    const navigate = useNavigate();

    const wsData = location.state?.wsData;

    const isNewWorkspace = !id && wsData;
    const isExistingWorkspace = !!id;

    // Unpack the Wsdata 
    // const {
    //     workspaceName,
    //     projectIdea,
    //     features,
    //     scope,
    //     feasibility,
    //     architecture
    // } = wsData;
    const {
        workspaceName,
        projectIdea,
        features = [],
        scope = {},
        feasibility = {},
        architecture = {}
    } = wsData ?? {};

    // Nested Unpack
        const {
        goal,
        timeline,
        budget,
        focusAreas
    } = scope;

    const {
        complexity,
        duration,
        possibleRisks
    } = feasibility;

    const {
    selectedArchitecture = "",
    selectedStack = []
    } = architecture;

    const [WSname, setWSName] = useState(wsData?.workspaceName ?? "");
    const [stack , setStack] = useState(selectedStack);
    const [architecture_category , setArchitectureCategory] = useState(selectedArchitecture);
    const [featuresState , setFeaturesState] = useState(features);

    // Controls loading and content of proj description, learning resources, and checklist
    const [loadingWorkspace, setLoadingWorkspace] = useState(true);
    const [content , setContent] = useState(null);

    // Controls loading and content of archmap
    const [loadingArchitecture, setLoadingArchitecture] = useState(true);
    const [architectureMap, setArchitectureMap] = useState(null);

    // Controls loading and content of roadmap
    const [loadingRoadmap, setLoadingRoadmap] = useState(true);
    const [roadmap, setRoadmap] = useState(null);

    // Controls unlocked buttons
    const [loadingDocs , setLoadingDocs] = useState(null);
    const [docsOpen, setDocsOpen] = useState(false);
    const [docsTitle, setDocsTitle] = useState("");
    const [docsContent, setDocsContent] = useState(null);

    // Controls progress bar
    const [doneTasks , setDoneTasks] = useState([]);

    const learningTasks = content?.checklist?.learningTopics ?? [];
    const implementationTasks = content?.checklist?.implementationTasks ?? [];

    const allTasks = [...learningTasks, ...implementationTasks];
    
    // Tracking last saved
    const [lastSavedTasks, setLastSavedTasks] = useState([]);
    const [lastSavedTime , setLastSavedTime] = useState(null);


    const totalTasks = allTasks.length;
    const numTasksDone = doneTasks.length;

    const progress =
        totalTasks === 0
            ? 0
            : Math.round((numTasksDone / totalTasks) * 100);

    const unlocked = totalTasks > 0 && lastSavedTasks.length === totalTasks;

    const toggleTask = (task) => {
    setDoneTasks(prev => {
        if (prev.includes(task)) {
            return prev.filter(doneTask => doneTask !== task);
        }

        return [...prev, task];
    });
};

    const generateWS = async()=> {
        try{
            const response = await fetch("/api/createWS-api",
                {
                    method: "POST" ,
                    headers:{
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(wsData)
                }
            );

            const data = await response.json();
            
            if(!response.ok){
                console.error(data.error);
                console.log("Something happened!")
                return;
            }

            return data;

        }
        catch(err){
            console.error(err);
        }
    };

    const generateArch = async () => {
        try{
            const response = await fetch("/api/archmap-api", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"   
                },
                body: JSON.stringify(wsData)
            });
            const data = await response.json();

            if(!response.ok){
                console.error(data.error);
                console.log("Something happened!2")
                return;
            }


            return data;
        }
        catch(err){
            console.error(err);
        }

        
    };

    const generateRoadmap = async () => {
        try{
            
            const response = await fetch("/api/roadmap-api", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"   
                },
                body: JSON.stringify(wsData)
            });

            const data = await response.json();

            if(!response.ok){
                console.error(data.error);
                console.log("Something happened!3")
                return;
            }


            return data;
        }
        catch(err){
            console.error(err);
        }
    };


    const generateNewWorkspace = async () => {
        try{
            const [contentData ,archData ,roadmapData] = await Promise.all([
                generateWS(),
                generateArch(),
                generateRoadmap()
            ]);

            setContent(contentData);
            setArchitectureMap(archData);
            setRoadmap(roadmapData);

            setLoadingWorkspace(false);
            setLoadingArchitecture(false);
            setLoadingRoadmap(false);

            await saveWorkspaceToDB({
                ws_name: workspaceName , 
                content: contentData ,
                features: featuresState ,
                arch_stack: { selectedArchitecture: architecture_category, selectedStack: stack },
                archmap: archData ,
                roadmap: roadmapData ,
                status: {
                    percentage: progress ,
                    doneTasks: doneTasks
                },
                updated_at: new Date().toISOString()
                });
        }
        catch(err){
            console.error("Error saving workspace to DB:", err);
        }
    }

    const saveWorkspaceToDB = async (workspaceFinalData) => {
        try{
            // Get the current session/token
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError || !session?.access_token) {
                throw new Error("Not authenticated");
            }

            const response = await fetch("/api/saveWorkspace-api", {
                method: "POST",
                headers:{ "Content-Type": "application/json" ,
                    "Authorization": `Bearer ${session.access_token}`
                },
                body: JSON.stringify(workspaceFinalData)
            });

           

            const data = await response.json();

            if(!response.ok){
                console.error(data.error);
                console.log("Something happened!4")
                return;
            }

            const wsID = data.wsID;
            // console.log("Workspace saved to DB!!");

            setLastSavedTasks(workspaceFinalData.status.doneTasks);
            setLastSavedTime(workspaceFinalData.updated_at);

            navigate(`/WS/${wsID}` , {replace: true});
        }   
        catch(err){
            console.error("Error saving workspace to DB:", err);
        }
    };


    const loadExistingWorkspace = async () => {
        try{

            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError || !session?.access_token) {
                throw new Error("Not authenticated");
            }
            
            const response = await fetch(`/api/loadWorkspace-api?id=${id}`, {
                method: "GET",
                headers:{ "Content-Type": "application/json" ,
                    "Authorization": `Bearer ${session.access_token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error(errorData.error);
                return;
            }

            const workspaceData = await response.json();
            // Unpack
            setContent(workspaceData.content);
            setArchitectureMap(workspaceData.archmap);
            setRoadmap(workspaceData.roadmap);
            setDoneTasks(workspaceData.status.doneTasks);

            // Rest --> Features , Architecture , Stack 
            setFeaturesState(workspaceData.features);
            setArchitectureCategory(workspaceData.arch_stack.selectedArchitecture);
            setStack(workspaceData.arch_stack.selectedStack);

            // Workspace Name
            setWSName(workspaceData.ws_name);

            // Last Saved Time
            setLastSavedTasks(workspaceData.status.doneTasks);
            setLastSavedTime(workspaceData.updated_at);            

            setLoadingWorkspace(false);
            setLoadingArchitecture(false);
            setLoadingRoadmap(false);

            
        }
        catch(err){
            console.error("Error loading existing workspace:", err);
        }
    };

    useEffect(() => {
        if (isNewWorkspace) {
            // generateWS();
            // generateArch();
            // generateRoadmap();
            generateNewWorkspace();
        }else if (isExistingWorkspace) {
            loadExistingWorkspace();
        }
        else{
            console.error("No workspace data provided.");
        }
        
    }, [id, wsData]);


    // Save Button --> Updates WS in DB 
    // Only Update the status and updated_at fields in the DB
    const handleSave = async () => {

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
        if (sessionError || !session?.access_token) {
            throw new Error("Not authenticated");
        }

        const timeNow = new Date().toISOString();

        const response = await fetch("/api/updateWorkspace-api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`
            },
            body: JSON.stringify({
                ws_id: id,
                status: {
                    doneTasks,
                    percentage: progress
                },
                updated_at: timeNow
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(data.error);
            return;
        }

        setLastSavedTasks(doneTasks);
        setLastSavedTime(timeNow);

        alert("Current Progress Saved!!");
    }


    // Home Button --> Navigate to Home Page
    const handleHome = () => {


        if (lastSavedTasks !== doneTasks) {
            const confirmLeave = window.confirm(
                "You have unsaved changes. \nYou're last save was at " + new Date(lastSavedTime).toLocaleString()+ ".\n Are you sure you want to leave?"
            );
            if (!confirmLeave) {
                return;
            }
            else{
                navigate(`/dashboard`);
            }  
    } 
    navigate(`/dashboard`);
}

    // Delete Button Click Handler
    const handleDelete = async () => {
        const confirmLeave = window.confirm(
                "Are you sure you want to delete this workspace?\nThis action cannot be undone!!"
            );
            if (!confirmLeave) {
                return;
            }
            else{

                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                    
                if (sessionError || !session?.access_token) {
                    throw new Error("Not authenticated");
                }

                const response = await fetch("/api/deleteWorkspace-api", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session.access_token}`
                    },
                    body: JSON.stringify({
                        ws_id: id
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    console.error(data.error);
                    return;
                }

                alert("Workspace Deleted!!");
                navigate(`/dashboard`);
            }  
        
        
    }

    const handleUnlock = async(docType) =>{

        setLoadingDocs(docType);

        try{
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
        if (sessionError || !session?.access_token) {
            throw new Error("Not authenticated");
        }


        const response = await fetch("/api/unlocked-api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`
            },
            body: JSON.stringify({
                ws_id: id,
                type: docType
            })
        });

        const data = await response.json();

        setDocsTitle(docType);
        setDocsContent(data.data);
        setDocsOpen(true);

        if (!response.ok) {
            console.error(data.error);
            return;
        }
       
    }catch(err){
            console.error("Error:", err);
        }

        setLoadingDocs(null);

    }



    return(
        
        <div className="ws-page">
                <nav className="ws-nav">
                        <div className="ws-profile">
                        <img src="/icon2.png" className="ws-profile-icon" />
                        <h1> Astra AI</h1>
                        </div>
                        <div className="ws-nav-buttons">
                            <img src="/icon27.png" className="nav-home-icon" onClick={handleHome} />
                            <img src="/icon24.png" className="nav-save-icon" onClick={handleSave} />
                            <img src="/icon25.png" className="nav-delete-icon" onClick={handleDelete} />
                        </div>
                </nav>
                <div className="ws-background-image"></div>
                
                <div className="ws-area">
                    <h1 className="project-name">{WSname}</h1>
                    {/* Style Workspace Name neatly */}
                    <div className="ws-progress">
                        <p className="tasks-done">{numTasksDone} / {totalTasks} tasks completed</p>
                        <div className="ws-progress-meter">
                            <span className={unlocked ? "progress-complete" : ""} style={{ width: `${progress}%` }}></span>
                        </div>
                    </div>

                    <h1 className="section-name">Workspace Overview</h1>
                    <div className="ws-layout">
                        <h2>Project Description</h2>
                        {/* <p className="description">{projectIdea}</p> */}
                        {loadingWorkspace ? (
                            <div className="loading-body"><img src="/icon20.png" className="loading-icon2" /></div>
                        ) : (
                            <p className="description">
                                {content?.overview?.projectDescription}
                            </p>
                        )}
                        <h2>Features</h2>
                        <div className="features-list">
                            {/* <p>Authentication</p>
                            <p>Notifications</p>
                            <p>Parsing</p>
                            <p>Ranking</p> */}
                            {featuresState.map(feature => (
                                <p key={feature}>{feature}</p>
                            ))}
                        </div>
                        <h2>Selected Tech Stack & Architecture</h2>
                         <div className="stack-list">
                            <div className="stack-name">
                            <p>Archtiecture:</p>
                            {/* <p>Frontend:</p>
                            <p>Backend:</p>
                            <p>Database:</p>
                            <p>Deployment:</p> */}
                            {stack.map(stack => (
                                <p key={stack.category}>
                                        {stack.category}:
                                </p>
                            ))}
                            </div>
                            <div className="stack-option">
                                <p><span style={{color: "whitesmoke" }}>{architecture_category}</span></p>
                                {/* <p><span style={{color: "whitesmoke"}}>React</span></p>
                                <p><span style={{color: "whitesmoke"}}>Express</span></p>
                                <p><span style={{color: "whitesmoke" }}>PostgreSQL</span></p>
                                <p><span style={{color: "whitesmoke"}}>Vercel</span></p> */}
                                {stack.map(stack => (
                                <p key={stack.category}>
                                    <span style={{ color: "whitesmoke" }}>
                                         {stack.selected}
                                    </span>
                                </p>
                            ))}
                            </div>
                        </div>
                    </div>

                    <h1 className="section-name">Architecture Diagram</h1>
                    <div className="ws-layout">
                        {/* <div className="diagram"> */}
                        {/* <div className="layer">
                            <p className="layer-element">Client (React)</p>
                        </div>
                        <img src="/icon22.png" className="layer-icon" />
                        <div className="layer">
                            <p className="layer-element">API Gateway</p>
                            <p className="layer-element">Auth Service</p>
                        </div>
                        <img src="/icon22.png" className="layer-icon" />
                        <div className="layer">
                            <p className="layer-element">Parser</p>
                            <p className="layer-element">Ranking Engine</p>
                        </div>
                        <img src="/icon22.png" className="layer-icon" />
                        <div className="layer">
                            <p className="layer-element">PostgreSQL (Supabase)</p>
                        </div> */}                        
                        {/* </div> */}
                        {loadingArchitecture ? (
                            <div className="loading-body">
                                <img src="/icon20.png" className="loading-icon2" />
                            </div>
                        ) : (
                            <div className="diagram">

                                {architectureMap?.layers?.map((layer, index) => (
                                    <div key={index}>

                                        <div className="layer">
                                            {layer.nodes.map((node, nodeIndex) => (
                                                <p key={nodeIndex} className="layer-element">
                                                    {node.label}
                                                </p>
                                            ))}
                                        </div>

                                        {index < architectureMap.layers.length - 1 && (
                                            <img src="/icon22.png" className="layer-icon" />
                                        )}

                                    </div>
                                ))}

                            </div>
                        )}

                        
                    </div>
                    <h1 className="section-name">Roadmap</h1>
                    <div className="ws-layout">
                        {loadingRoadmap ? (

                        <div className="loading-body">
                            <img
                                src="/icon20.png"
                                className="loading-icon2"
                            />
                        </div>

                    ) : (

                        <RoadmapFlow roadmap={roadmap} />

                    )}
                    </div>

                    <h1 className="section-name">Learning Resources</h1>
                    <div className="ws-layout">
                    <h2>Video Tutorials</h2>
                    {/* <div className="learning-list">
                            <p>Video1</p>
                            <p>Video2</p>
                            <p>Video3</p>
                    </div> */}
                    {loadingWorkspace ? (
                        <div className="loading-body"><img src="/icon20.png" className="loading-icon2" /></div>
                    ) : (
                        <div className="learning-list">
                            {content?.learningResources?.videos.map((video, index) => (
                                <p key={index}>
                                    {video.title} - {video.creator}
                                </p>
                            ))}
                        </div>
                    )}
                    <h2>Documentation</h2>
                    {/* <div className="learning-list">
                            <p>Doc1</p>
                            <p>Doc2</p>
                            <p>Doc3</p>
                    </div> */}
                    {loadingWorkspace ? (
                        <div className="loading-body"><img src="/icon20.png" className="loading-icon2" /></div>
                    ) : (
                        <div className="learning-list">
                            {content?.learningResources?.documentation.map((doc, index) => (
                                <p key={index}>
                                    {doc.title} - {doc.source}
                                </p>
                            ))}
                        </div>
                    )}
                    <h2>Articles</h2>
                    <div className="learning-list">
                            {/* <p>Paper1</p>
                            <p>Paper2</p>
                            <p>Paper3</p> */}
                    {loadingWorkspace ? (
                       <div className="loading-body"><img src="/icon20.png" className="loading-icon2" /></div>
                    ) : (
                        <div className="learning-list">
                            {content?.learningResources?.articles.map((article, index) => (
                                <p key={index}>
                                    {article.title} - {article.authors}
                                </p>
                            ))}
                        </div>
                    )}
                    </div>
                    </div>

                    <h1 className="section-name">Checklist</h1>
                    <div className="ws-layout">
                    <h2>Learning Topics</h2>
                    {/* <div className="checklist-container">
                        <h2><input type="checkbox"/>REST API Fundamentals</h2>
                        <h2><input type="checkbox"/>Authentication & JWT</h2>
                        <h2><input type="checkbox"/>Natural Language Basics (NLP) Basics</h2>
                        <h2><input type="checkbox"/>Serverless Deployment Patterns</h2>
                    </div> */}
                    {loadingWorkspace ? (
                        <div className="loading-body"><img src="/icon20.png" className="loading-icon2" /></div>
                    ) : (
                        <div className="checklist-container">
                            {content.checklist?.learningTopics?.map((topic, index) => (
                                <h2 key={index}>
                                    <input type="checkbox" 
                                    checked={doneTasks.includes(topic)}
                                    onChange={() => toggleTask(topic)}
                                    />
                                    
                                    {topic}
                                </h2>
                            ))}
                        </div>
                    )}
                    <h2>Implementation Tasks</h2>
                    {/* <div className="checklist-container">
                        <h2><input type="checkbox"/>Setup project repo and CI</h2>
                        <h2><input type="checkbox"/>Build authentication flow</h2>
                        <h2><input type="checkbox"/>Resume upload endpoint</h2>
                        <h2><input type="checkbox"/>Implement parsing logic</h2>
                        <h2><input type="checkbox"/>Build ranking engine</h2>
                        <h2><input type="checkbox"/>Dashboard UI</h2>
                        <h2><input type="checkbox"/>Notifications System</h2>
                        <h2><input type="checkbox"/>Database migrations</h2>                        
                    </div>
                     */}
                     {loadingWorkspace ? (
                        <div className="loading-body"><img src="/icon20.png" className="loading-icon2" /></div>
                    ) : (
                        <div className="checklist-container">
                            {content?.checklist?.implementationTasks.map((topic, index) => (
                                <h2 key={index}>
                                    <input type="checkbox"
                                    checked={doneTasks.includes(topic)}
                                    onChange={() => toggleTask(topic)}
                                    />
                                    {topic}
                                </h2>
                            ))}
                        </div>
                    )}
                    </div>

                    <h1 className="section-name">Documentation</h1>
                    <div className="ws-layout">
                        
                        <div className="ws-buttons">
                            <button onClick={() => handleUnlock("readme")}>
                                {loadingDocs === "readme"
                                ? <img src="/icon20.png" className="loading-icon" style={{width: "20px", height: "20px"}} />
                                : "Generate Readme"}
                            </button>
                            <button onClick={() => handleUnlock("cvBullets")}>
                                {loadingDocs === "cvBullets"
                                ? <img src="/icon20.png" className="loading-icon" style={{width: "20px", height: "20px"}} />
                                : "Generate CV Bullets"}
                            </button>
                            <button onClick={() => handleUnlock("interviewPrep")}>
                                {loadingDocs === "interviewPrep"
                                ? <img src="/icon20.png" className="loading-icon" style={{width: "20px", height: "20px"}} />
                                : "Interview Prep"}
                            </button>
                            <button onClick={() => handleUnlock("qaGuide")}>
                                {loadingDocs === "qaGuide"
                                ? <img src="/icon20.png" className="loading-icon" style={{width: "20px", height: "20px"}} />
                                : "Q&A"}
                            </button>
                        </div>
                        {!unlocked && (<div className="locked"></div>)}
                        {/* <div className="locked"></div> */}
                        <DocsCard
                            isOpen={docsOpen}
                            onClose={() => setDocsOpen(false)}
                            title={docsTitle}
                            data={docsContent}
                        />
                        
                    </div>
                    

                </div>
          
        </div>
    );
}

export default Workspace;


// To Do:
// 1) Progress bar 
// 2) Overview --> Project description (Generate it in a more comprehensive way --> createWs-api) / Features / Selected Tech Stack
// 3) Archtiecture Diagram --> simpleeee --> archmap-api
// 4) Roadmap Implementation --> Generate it --> roadmap-api
// 5) Learning Resources --> Video tutorials / Documentation / Articles --> createWs-api
// 6) Checklist --> Implenetation tasks / Learning topic names only --> createWs-api
// 7) Documentation --> Readme / CV Bullets / Interview prep / Q&A --> documentation-api

