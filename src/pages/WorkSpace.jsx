import "../styles/ws.css";
import { useState } from "react";


function Workspace(){

    return(
        
        <div className="ws-page">
                <nav className="ws-nav">
                        <img src="/icon2.png" className="ws-profile-icon" />
                        <h1> Astra AI</h1>
                </nav>
                <div className="ws-background-image"></div>
                
                <div className="ws-area">
                    <h1 className="project-name">Project Victor</h1>
                    <div className="ws-progress-meter">
                        <span style={{ width: "50%" }}></span>
                    </div>

                    <h1 className="section-name">Workspace Overview</h1>
                    <div className="ws-layout">
                        <h2>Project Description</h2>
                        <p className="description">An AI-assisted tool that scans incoming résumés, extracts key skills and experience, 
                            and ranks candidates against a given job description, built to help small teams cut down manual screening time.</p>
                        <h2>Features</h2>
                        <div className="features-list">
                            <p>Authentication</p>
                            <p>Notifications</p>
                            <p>Parsing</p>
                            <p>Ranking</p>
                        </div>
                        <h2>Selected Tech Stack</h2>
                         <div className="stack-list">
                            <div className="stack-name">
                            <p>Archtiecture:</p>
                            <p>Frontend:</p>
                            <p>Backend:</p>
                            <p>Database:</p>
                            <p>Deployment:</p>
                            </div>
                            <div className="stack-option">
                                <p><span style={{color: "whitesmoke" }}>Severless</span></p>
                                <p><span style={{color: "whitesmoke"}}>React</span></p>
                                <p><span style={{color: "whitesmoke"}}>Express</span></p>
                                <p><span style={{color: "whitesmoke" }}>PostgreSQL</span></p>
                                <p><span style={{color: "whitesmoke"}}>Vercel</span></p>
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

                </div>
          
        </div>
    );
}

export default Workspace;


// To Do:
// 1) Progress bar 
// 2) Overview --> Project description / Features / Selected Tech Stack
// 3) Archtiecture Diagram --> simpleeee
// 4) Roadmap Implementation 
// 5) Learning Resources --> Video tutorials / Documentation / Articles
// 6) Checklist --> Implenetation tasks / Learning topic names only
// 7) Mentor Icon 
// 8) Deployment Checklist 
// 9) Documentation --> Readme / CV Bullets / Interview prep / Q&A

