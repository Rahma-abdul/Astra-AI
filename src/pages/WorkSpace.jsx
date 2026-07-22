import "../styles/ws.css";
import { useState , useEffect} from "react";
import { useLocation } from "react-router-dom";
import DashboardFlow from "../components/dashboardFlow";



function Workspace(){

    const location = useLocation();

    const wsData = location.state?.wsData;
    console.log(wsData);

    // Unpack the Wsdata 
    const {
        workspaceName,
        projectIdea,
        features,
        scope,
        feasibility,
        architecture
    } = wsData;

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
        selectedArchitecture,
        selectedStack
    } = architecture;

    const [loadingWorkspace, setLoadingWorkspace] = useState(true);
    const [content , setContent] = useState(null);

    useEffect(() => {
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

                setContent(data);
                setLoadingWorkspace(false);


            }
            catch(err){
                console.error(err);
            }
        };
        generateWS();
    }, []);



    return(
        
        <div className="ws-page">
                <nav className="ws-nav">
                        <img src="/icon2.png" className="ws-profile-icon" />
                        <h1> Astra AI</h1>
                </nav>
                <div className="ws-background-image"></div>
                
                <div className="ws-area">
                    <h1 className="project-name">{workspaceName}</h1>
                    {/* Style Workspace Name neatly */}
                    <div className="ws-progress-meter">
                        <span style={{ width: "50%" }}></span>
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
                            {features.map(feature => (
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
                            {selectedStack.map(stack => (
                                <p key={stack.category}>
                                        {stack.category}:
                                </p>
                            ))}
                            </div>
                            <div className="stack-option">
                                <p><span style={{color: "whitesmoke" }}>{selectedArchitecture}</span></p>
                                {/* <p><span style={{color: "whitesmoke"}}>React</span></p>
                                <p><span style={{color: "whitesmoke"}}>Express</span></p>
                                <p><span style={{color: "whitesmoke" }}>PostgreSQL</span></p>
                                <p><span style={{color: "whitesmoke"}}>Vercel</span></p> */}
                                {selectedStack.map(stack => (
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
                        <div className="diagram">
                        <div className="layer">
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
                        </div>
                        </div>
                        
                    </div>
                    <h1 className="section-name">Roadmap</h1>
                    <div className="ws-layout">
                    <DashboardFlow/>
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
                                    {doc.title}: {doc.source}
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
                                    <input type="checkbox" />
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
                                    <input type="checkbox" />
                                    {topic}
                                </h2>
                            ))}
                        </div>
                    )}
                    </div>

                    <h1 className="section-name">Documentation</h1>
                    <div className="ws-layout">
                        
                        <div className="ws-buttons">
                            <button>Generate Readme</button>
                            <button>Generate CV Bullets</button>
                            <button>Interview Prep</button>
                            <button>Q&A</button>
                        </div>
                        <div className="locked"></div>
                        
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

