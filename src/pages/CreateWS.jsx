import { useState , useEffect} from "react";
import { useNavigate} from "react-router-dom";
import "../styles/newWS.css";


function CreateWS(){

    const [stage ,setStage] = useState(1);
    const [loading , setLoading] = useState(false);

    // Stagw 1 Variables
    const [workspaceName , setWorkspaceName] = useState("");
    const [projectIdea , setProjectIdea] = useState("");
    
    // Stage 2 Variables
    const [features , setFeatures] = useState([]);
    const [newFeature , setNewFeature] = useState("");
    const [showModal , setShowModal] =useState(false);
    const [selectedFeatures , setSelectedFeatures] = useState([]);

    // Stage 3 Variables
    const [goal , setGoal] = useState("");
    const [timeline , setTimeline] = useState("");
    const [budget , setBudget] = useState("");
    const [focusAreas , setFocusAreas] = useState([]);
    const focusOptions = [
            "Frontend Development",
            "Backend Development",
            "Database Design and Management",
            "AI and Machine Learning",
            "Computer Vision",
            "Docker",
            "Kubernetes",
            "CI/CD",
            "Testing",
            "Data Analysis",
            "Robotics"
        ];

    const [showModify , setShowModify] =useState(false);
    const [complexity , setComplexity] = useState("Intermediate");
    const [duration , setDuration] = useState("73");
    const [risks , setRisks] = useState([]);

    // In case user cancels 
    const [draftComplexity , setDraftComplexity] = useState(complexity);
    const [draftDuration , setDraftDuration] = useState(duration);


    const [showOthers , setShowOthers] =useState(false);

    // const architectureOptions = {
    //     recommended: "Serverless" ,
    //     alternatives: ["Monolithic Backend", "Microservices"]

    // }
    const [architectureOptions , setArchitectureOptions] = useState({
        recommended: "" ,
        alternatives: []
    });

    const [stackOptions , setStackOptions] = useState([]);
    const [archReason, setArchReason] = useState("");

    // const stackOptions ={
        
    // frontend: {
    //     recommended: "React",
    //     alternatives: ["Vue", "Angular"]
    // },
    // backend: {
    //     recommended: "Express",
    //     alternatives: ["FastAPI", "Django"]
    // },
    // database: {
    //     recommended: "PostgreSQL",
    //     alternatives: ["MongoDB", "MySQL"]
    // }
    // };

    const [selectedArchitecture, setSelectedArchitecture] = useState("");
    // selected stack mesh darory dol bas --> fix it later
    const [selectedStack, setSelectedStack] = useState([]);

    const [draftArch , setDraftArch] = useState(selectedArchitecture);
    const [draftStack , setDraftStack] = useState(selectedStack);



    // const [features , setFeatures] = useState([
    //     "Authentication",
    //     "Dashboard",
    //     "Notifications",
    //     "Analytics",
    //     "Chatbot"
    // ]);

    const [wsData , setWSData] = useState({
        // Stage 1
        workspaceName: "",
        projectIdea: "",
        // Stage 2
        features: [],
        // Stage 3
        scope: {
            goal: "",
            timeline: "",
            budget: "",
            focusAreas: []
        },
        // Stage 4
        feasibility: {
            complexity: "",
            duration: "",
            possibleRisks: []
        },
        // Stage 5
        architecture: {
            // To be modified later
            selectedArchitecture: "",
            selectedStack: {}
        }
    });


    const addFeature = () =>{
        if (newFeature.trim() === "") return;
        const featureNorm = newFeature.trim().toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()); 
        // console.log("Feature is:" , featureNorm);
        setFeatures([...features, featureNorm]);
        setNewFeature("");
        setShowModal(false);
    };

    const modifyComplexity_Duration =() =>{
        // Close modal after user saves changes
        setComplexity(draftComplexity);
        setDuration(draftDuration);
        setShowModify(false);
    }

    const modifyArch_Stack = () => {
        setSelectedArchitecture(draftArch);
        setSelectedStack(draftStack);
        setShowOthers(false);

    }

    const isAllRecommended =
    selectedArchitecture === architectureOptions.recommended &&
    Object.entries(stackOptions).every(
        ([stack, options]) => selectedStack[stack] === options.recommended
    );
    

    const nextStage = () =>{
        setLoading(true);

        if (stage === 5) {
            setTimeout(() => {
            setLoading(false);
            navigate(`/WS`);
        }, 2500);
        }
        
        setTimeout(() => {
            setLoading(false);
            setStage(stage +1);
        }, 2500);
    };


    const getProgress = () => {
    if (loading && stage === 1) return 8;
    if (loading && stage === 3) return 55;
    if (loading && stage === 4) return 75;
    if (loading && stage === 5) return 100.1;
    switch (stage) {
        case 1: return 2;
        case 2: return 20;
        case 3: return 45;
        case 4: return 65;
        case 5: return 90;
        default: return 0;
    }
};

    // to stop the scrolling of the page once any modal is active
    useEffect(() => {
    const anyModalOpen = showModal || showModify || showOthers;
        document.body.style.overflow = anyModalOpen ? "hidden" : "auto";
    }, [showModal, showModify, showOthers]);

    
    const navigate = useNavigate();

    const nextStage1 = async() =>{
        if (!workspaceName.trim()){
            alert("Please enter a workspace name.");
            return;
        }

        if (!projectIdea.trim()){
            alert("Please enter a project idea.");
            return;
        }

        setLoading(true);

        try {   
            const response = await fetch("/api/features-api", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"},
                body: JSON.stringify({ projectName: workspaceName, idea: projectIdea })
            });

            const data = await response.json();
            
            if (!response.ok) {
                console.error("Error extracting features:", data.error);
                alert(data.error || "Failed to extract features.");
                setLoading(false);
                return;
            }
            const featuresArray = data.features.map(feature => feature.name);
            setFeatures(featuresArray);
            setStage(stage + 1);

        } catch(err){
            console.error(err);
            alert("Failed to extract features. Please try again.");
        }

            setLoading(false);
    };


    const nextStage2 = () =>{
        if (selectedFeatures.length === 0) {
        alert("Please select at least one feature.");
        return;
        }

        const updatedWsData = {
            ...wsData,
            workspaceName: workspaceName,
            projectIdea: projectIdea,
            features: selectedFeatures
        };
        setWSData(updatedWsData);
        // console.log("Workspace Data after Stage 2:", updatedWsData);
        setStage(stage + 1);

    };

    const nextStage3 = async () =>{
        if (!goal.trim() || !timeline.trim() || !budget.trim() || focusAreas.length === 0) {
            alert("Please fill in all fields and select at least one focus area."); 
            return;
        }

        const updatedWsData = {
            ...wsData,
            scope: {
                goal: goal,
                timeline: timeline,
                budget: budget,
                focusAreas: focusAreas
            }
        };
        setWSData(updatedWsData);
        console.log("Workspace Data after Stage 3:", updatedWsData);
        
        setLoading(true);
        // Call feasibility API here

        try {   
            const response = await fetch("/api/feasibility-api", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"},
                body: JSON.stringify({ workspaceName, projectIdea, features: selectedFeatures, scope: updatedWsData.scope })
            });

            const data = await response.json();
            
            if (!response.ok) {
                console.error("Error during feasibility analysis:", data.error);
                alert(data.error || "Failed to analyze feasibility.");
                setLoading(false);
                return;
            }
            
            setComplexity(data.complexity);
            setDuration(data.duration); 
            setRisks(data.possibleRisks);

        // Wait and and set wsData in the beginning of the nextStage4 function
        // So if the user modifies the complexity and duration, it will be reflected in the workspace data
        

        } catch(err){
            console.error(err);
            alert("Failed to analyze feasibility. Please try again.");
        }

        setLoading(false);

        setStage(stage + 1);

    };

    const nextStage4 = async () =>{

        const updatedWsData = {
        ...wsData,
            feasibility: {
                complexity: complexity,
                duration: duration,
                possibleRisks: risks
            }
        };
        setWSData(updatedWsData);
        console.log("Workspace Data after Stage 4:", updatedWsData);

        setLoading(true);

        // call architecture API here
        try {   
            const response = await fetch("/api/architecture-api", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"},
                body: JSON.stringify({ workspaceName, projectIdea, features: selectedFeatures, scope: updatedWsData.scope , feasibility: updatedWsData.feasibility})
            });

            const data = await response.json();
            
            if (!response.ok) {
                console.error("Error during generating architecture:", data.error);
                alert(data.error || "Failed to generate architecture.");
                setLoading(false);
                return;
            }
            
            setArchitectureOptions({
                recommended: data.recommendedArchitecture,
                alternatives: data.alternativeArchitectures
            });

            setStackOptions(data.stack);

            setSelectedArchitecture(data.recommendedArchitecture);
            setSelectedStack(
                data.stack.map(item => ({
                category: item.category,
                selected: item.recommended
            }))
            );

            setArchReason(data.why);
            

        } catch(err){
            console.error(err);
            alert("Failed to generate architecture. Please try again.");
        }

        setStage(stage + 1);
        setLoading(false);
    }




    return(
        <div className="createWS-page">
            <div className="background-createWS"></div>
            <img src="/icon2.png" className="big-profile-icon" />
                   
            <div className="progress">
                <div className={`progress-step ${stage>=1? "active": ""}`}>Idea</div>
                <div className={`progress-step ${stage>=2? "active": ""}`}>Features</div>
                <div className={`progress-step ${stage>=3? "active": ""}`}>Scope</div>
                <div className={`progress-step ${stage>=4? "active": ""}`}>Feasibility</div>
                <div className={`progress-step ${stage>=5? "active": ""}`}>Architecture</div>
            </div>
            <div className="progress-meter">
                <span style={{ width: `${getProgress()}%` }}></span>
            </div>

            
            {(loading && stage === 1 )? (
                <>
                {/* <div className="progress-meter">
                     <span style={{width: "8%"}}></span>
                    </div> */}
                <div className="ws-card">
                    <h3>Analyzing <span style={{color: "white"}}>your project</span></h3>
                    <img src="/icon20.png" className="loading-icon" />
                    <div className="loading-list">
                        <p>Understanding project idea</p>
                        <p>Extracting features</p>
                    </div>
                </div>
                </>
            ):(loading && stage === 3 )? (
                <>
                {/* <div className="progress-meter">
                     <span style={{width: "50%"}}></span>
                    </div> */}
                <div className="ws-card">
                    <h3>Running <span style={{color: "white"}}>Feasibility Analysis</span></h3>
                    <img src="/icon20.png" className="loading-icon" />
                    <div className="loading-list">
                        <p>Calculation Complexity</p>
                        <p>Estimating Duration</p>
                        <p>Predicting Possible Risks</p>
                    </div>
                </div>
                </>
            ):(loading && stage === 4 )? (
                <>
                {/* <div className="progress-meter">
                     <span style={{width: "70%"}}></span>
                    </div> */}
                <div className="ws-card">
                    <h3><span style={{color: "white"}}>Generating</span> Architecture Recommendation</h3>
                    <img src="/icon20.png" className="loading-icon" />
                    <div className="loading-list">
                        <p>Generating list of stack options</p>
                        <p>Collecting pros and cons</p>
                    </div>
                </div>
                </>
            ):(loading && stage === 5 )? (
                <>
                {/* <div className="progress-meter">
                     <span style={{width: "100%"}}></span>
                    </div> */}
                <div className="ws-card">
                    <h3>Creating Your Workspace</h3>
                    <img src="/icon20.png" className="loading-icon" />
                </div>
                </>
            ):(
                <>
                { stage === 1 && (
                    <>
                    {/* <div className="progress-meter">
                     <span style={{width: "2%"}}></span>
                    </div> */}
                    <div className="ws-card">
                    <h3><span style={{color: "white"}}>Create New</span> Workspace</h3>
                    <h2>Workspace Name</h2>
                    <input value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} type="text" placeholder="Enter your workspace name" />
                    <h2>Project Idea</h2>
                    <textarea value={projectIdea} onChange={(e) => setProjectIdea(e.target.value)} placeholder="Describe your project idea or the problem you're trying to solve and how you plan on solving it"  /> 
                    <button onClick={nextStage1}>Continue</button>
                    </div>
                    </>
                )}
                { stage === 2 && (
                    <>
                    {/* <div className="progress-meter">
                     <span style={{width: "20%"}}></span>
                    </div> */}
                    <div className="ws-card">
                    <h3><span style={{color: "white"}}>AI Extracted</span> Features</h3>
                    <h2>Pick which ones fit your idea best</h2>
                    <div className="features-container">
                   
                    {features.map(feature => (
                        <h2 key={feature}>
                            <input type="checkbox" 
                            checked={selectedFeatures.includes(feature)} 
                            onChange={() => 
                                setSelectedFeatures(prev => 
                                    prev.includes(feature) 
                                        ? prev.filter(f => f !== feature) 
                                        : [...prev, feature]
                                )
                            } />
                            {feature}
                        </h2>
                    ))}

                    </div>
                    <button onClick={() => setShowModal(true)}>+ Add Feature</button>
                    <button onClick={nextStage2}>Confirm</button>
                    </div>
                    </>
                )}
                { stage === 3 && (
                    <>
                    {/* <div className="progress-meter">
                     <span style={{width: "40%"}}></span>
                    </div> */}
                    <div className="ws-card">
                    <h3><span style={{color: "white"}}>Tell Us</span> More</h3>
                    <label style={{fontSize: "1.5rem"}}>Goal</label>
                    <div className="timeline-container">
                    <h2><input type="radio" name="goal" onChange={() => setGoal("Learning/Academic")} />Learning/Academic</h2>
                    <h2><input type="radio" name="goal" onChange={() => setGoal("Production/Startup")} />Production/Startup</h2>
                    </div>

                    <label style={{fontSize: "1.5rem"}}>Timeline</label>
                    <div className="timeline-container">
                    <h2><input type="radio" name="time" onChange={() => setTimeline("1-3 weeks")} />1-3 weeks</h2>
                    <h2><input type="radio" name="time" onChange={() => setTimeline("1-3 months")} />1-3 months</h2>
                    <h2><input type="radio" name="time" value={timeline} onChange={() => setTimeline(timeline)} />Other: <input type="text" /></h2>
                    </div>

                    <label style={{fontSize: "1.5rem"}}>Budget</label>
                    <div className="timeline-container">
                    <h2><input type="radio" name="budget" onChange={() => setBudget("Free Tier")} />Free Tier</h2>
                    <h2><input type="radio" name="budget" onChange={() => setBudget("Limited")} />Limited</h2>
                    <h2><input type="radio" name="budget" onChange={() => setBudget("Unlimited")} />Unlimited</h2>
                    </div>

                    <label style={{fontSize: "1.5rem"}}>Focus Areas</label>
                    <div className="timeline-container">
                    {focusOptions.map(area => (
                            <h2 key={area}>
                                <input
                                    type="checkbox"
                                    checked={focusAreas.includes(area)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setFocusAreas(prev => [...prev, area]);
                                        } else {
                                            setFocusAreas(prev =>
                                                prev.filter(item => item !== area)
                                            );
                                        }
                                    }}
                                />
                                {area}
                            </h2>
                    ))}
                    
                    </div>
                    
                    <button onClick={nextStage3}>Continue</button>
                    </div>
                    </>
                )}
                { stage === 4 && (
                    <>
                    {/* <div className="progress-meter">
                     <span style={{width: "60%"}}></span>
                    </div> */}
                    <div className="ws-card">
                    <h3><span style={{color: "white"}}>AI ran</span> Feasibility Analysis</h3>
            
                    <div className="features-container">
                        <h2><span style={{color: "#958fe5" , fontWeight: "800"}}>Complexity:</span> <span style={{fontFamily: "`Inter`, sans-serif" , letterSpacing: "-0.05em" , fontWeight: "400"}}>{complexity}</span></h2>
                        <h2><span style={{color: "#958fe5" , fontWeight: "800"}}>Implementation Estimated Duration:</span> <span style={{fontFamily: "`Inter`, sans-serif" , letterSpacing: "-0.05em" , fontWeight: "400"}}>{duration} hours</span></h2>
                        <h2 style={{color: "#958fe5" , fontWeight: "800"}}>Possible Risks:</h2>
                        <div className="regular-list">
                            {/* <p>Time might be too tight</p>
                            <p>Needs extensive understanding of Machine Learning</p>
                            <p>Might need to change the budget plan</p> */}
                            {risks.map((risk, index) => (
                                <p key={index}>{risk}</p>
                            ))}
                        </div>
                    </div>
                    <button onClick={()=>{ setDraftComplexity(complexity); setDraftDuration(duration); setShowModify(true);}}>Modify</button>
                    <button onClick={nextStage4}>Confirm</button>
                    </div>
                    </>
                )}
                { stage === 5 && (
                    <>
                    {/* <div className="progress-meter">
                     <span style={{width: "80%"}}></span>
                    </div> */}
                    <div className="ws-card">
                    <h3><span style={{color: "white"}}>Architecture & Stack</span> Generation</h3>
                    
                    {/* {isAllRecommended && (<h2 style={{ background: "linear-gradient(to right,#28dfef 0%, #a06bff 50%, #ff5fd1 100%)", backgroundClip: "text",color: "transparent" , textAlign: "center"}}>Recommended</h2>)} */}
                    <h2>{isAllRecommended && (<h2 style={{ background: "linear-gradient(to right,#28dfef 0%, #a06bff 50%, #ff5fd1 100%)", backgroundClip: "text",color: "transparent"}}>Recommended</h2>)}Architecture:</h2>
                    <div className="regular-list">
                        <p><span style={{color: "#958fe5" , fontSize: "1.4rem"}}>{selectedArchitecture} </span></p>
                    </div>
                    <h2>Stack:</h2>
                        <div className="regular-list">
                            {/* <p><span style={{color: "#958fe5" , fontSize: "1.4rem"}}>Frontend: </span> React.js</p>
                            <p><span style={{color: "#958fe5" , fontSize: "1.4rem"}}>Backend: </span> Express.js</p>
                            <p><span style={{color: "#958fe5" , fontSize: "1.4rem"}}>Database: </span> Supabase</p>
                            <p><span style={{color: "#958fe5" , fontSize: "1.4rem"}}>Deployment: </span> Vercel</p> */}
                            {/* {Object.entries(selectedStack).map(([stack , options]) => (
                            <p key={stack}><span style={{color: "#958fe5" , fontSize: "1.4rem"}}>{stack.charAt(0).toUpperCase() + stack.slice(1)}:</span> {options}</p>
                            ))} */}
                            {
                                selectedStack.map(stack => (
                                    <p key={stack.category}>
                                        <span
                                            style={{
                                                color:"#958fe5",
                                                fontSize:"1.4rem"
                                            }}
                                        >
                                            {stack.category.charAt(0).toUpperCase() + stack.category.slice(1)}:
                                        </span>
                                        {" "}
                                        {stack.selected}
                                    </p>
                            ))
                            }

                        </div>
                    {isAllRecommended && (
                    <>
                    <h2>Why?</h2>
                    <div className="regular-list">
                            <p><span style={{color: "#958fe5" , fontSize: "1.1rem"}}>
                                React simplifies building dynamic user interfaces through a modular, predictable, and highly efficient development paradigm. 
                                Express provides a thin layer of fundamental web application features without obscuring Node.js features. 
                                Supabase pairs a real PostgreSQL database with an automated, built-in suite of backend features.
                                Vercel offers zero-configuration Git integration, instant preview URLs for every pull request, and automatic global edge rendering.
                            </span></p>
                        </div>
                    </>
                    )}
                    <button onClick={()=>{ setDraftArch(selectedArchitecture); setDraftStack(selectedStack); setShowOthers(true)}}>Other Stack Options</button>
                    <button onClick={nextStage}>Continue</button>
                    </div>
                    </>
                    
                )}
               
                </>
            )
            }

            {showModal && (
            <div className="modal-overlay">

                <div className="modal-card">

                    <h2>Add Feature</h2>

                    <p>
                        Add a feature that wasn't suggested by Astra AI.
                    </p>

                    <input
                        type="text"
                        placeholder="Example: Dark Mode"
                        value={newFeature}
                        onChange={(e)=>setNewFeature(e.target.value)}
                    />

                    <div className="modal-buttons">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={()=>setShowModal(false)}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={addFeature}
                        >
                            Add
                        </button>

                    </div>

                </div>

            </div>
            )}

            {showModify && (
            <div className="modal-overlay">

                <div className="modal-card">

                        <h2>Complexity</h2>
                        <div className="timeline-container">
                        <h2 style={{fontSize: "1.1rem"}}>
                            <input
                                type="radio"
                                name="complexity"
                                value="Beginner"
                                checked={draftComplexity === "Beginner"}
                                onChange={(e) => setDraftComplexity(e.target.value)}
                            />
                            Beginner
                        </h2>
                        <h2 style={{fontSize: "1.1rem"}}>
                            <input
                                type="radio"
                                name="complexity"
                                value="Intermediate"
                                checked={draftComplexity === "Intermediate"}
                                onChange={(e) => setDraftComplexity(e.target.value)}
                            />
                            Intermediate
                        </h2>
                        <h2 style={{fontSize: "1.1rem"}}>
                            <input
                                type="radio"
                                name="complexity"
                                value="Advanced"
                                checked={draftComplexity === "Advanced"}
                                onChange={(e) => setDraftComplexity(e.target.value)}
                            />
                            Advanced
                        </h2>
                        <h2 style={{fontSize: "1.1rem"}}>
                            <input
                                type="radio"
                                name="complexity"
                                value="Expert"
                                checked={draftComplexity === "Expert"}
                                onChange={(e) => setDraftComplexity(e.target.value)}
                            />
                            Expert
                        </h2>
                        </div>
                    
                    <h2>Duration</h2>
                    <p>Change the hours you want to complete the whole project in</p>

                    <input
                        type="number"
                        placeholder="Example: 53"
                        value={draftDuration}
                        onChange={(e)=>setDraftDuration(e.target.value)}
                    />

                    <div className="modal-buttons">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={()=>setShowModify(false)}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={modifyComplexity_Duration}
                        >
                            Save
                        </button>

                    </div>

                </div>

            </div>
            )}

            {showOthers && (
            <div className="modal-overlay">

                <div className="modal-card">

                        <h2>Alternative Architecture</h2>
                        <div className="timeline-container">
                        {/* <h2 style={{fontSize: "1.1rem"}}>
                            <input
                                type="radio"
                                name="complexity"
                                value="Beginner"
                                checked={complexity === "Beginner"}
                                onChange={(e) => setComplexity(e.target.value)}
                            />
                            Beginner
                        </h2> */}
                       
                        {[architectureOptions.recommended, ...architectureOptions.alternatives].map(arch => (
                            <h2 style={{fontSize: "1.1rem"}} key={arch}>
                            <input
                                type="radio"
                                value={arch}
                                checked={draftArch === arch}
                                onChange={(e) => setDraftArch(e.target.value)}
                            />
                            {arch}
                        </h2>
                        ))}
                        </div>

                        <h2>Alternative Stack</h2>
                        <div className="timeline-container">
                        
                        {/* {Object.entries(stackOptions).map(([stack , options]) => (
                            <>
                            <h2 style={{fontSize: "1.1rem"}} key={stack}>{stack.charAt(0).toUpperCase() + stack.slice(1)}:</h2>
                            {[options.recommended, ...options.alternatives].map(choice => (
                            <h2 style={{fontSize: "1rem", paddingLeft: "1.5rem"}} key={choice}>
                                <input
                                    type="radio"
                                    name={stack}
                                    value={choice}
                                    checked={draftStack[stack] === choice}
                                    onChange={(e) =>
                                        setDraftStack({ ...draftStack, [stack]: e.target.value })
                                    }
                                />
                                {choice}
                            </h2>
                            ))}
                            
                        </>
                        ))}  */}
                        
                        {
                            stackOptions.map(category => (
                            <div key={category.category}>

                                <h2 style={{fontSize: "1.1rem"}}>
                                    {category.category.charAt(0).toUpperCase() + category.category.slice(1)}:
                                </h2>

                                {[category.recommended, ...category.alternatives].map(choice => (

                                    <h2 key={choice} style={{fontSize: "1rem", paddingLeft: "1.5rem"}}>

                                        <input
                                            type="radio"
                                            name={category.category}
                                            value={choice}
                                            checked={
                                                draftStack.find(
                                                    s => s.category === category.category
                                                )?.selected === choice
                                            }
                                            onChange={() =>
                                                setDraftStack(prev =>
                                                    prev.map(item =>
                                                        item.category === category.category
                                                            ? { ...item, selected: choice }
                                                            : item
                                                    )
                                                )
                                            }
                                        />

                                        {choice}

                                    </h2>

                                ))}

                            </div>
                        ))
                        }
                    
                    </div>
                    
                    <div className="modal-buttons">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={()=>setShowOthers(false)}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={modifyArch_Stack}
                        >
                            Review
                        </button>

                    </div>

                </div>

            </div>
            )}

        </div>
    );
}

export default CreateWS;


// TO DO: Fix Other option in timeline
// TO DO: Review Arch 