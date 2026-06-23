import "../styles/landing.css";
import LandingFlow from "../components/landingFlow";
import { useNavigate } from "react-router-dom";


function Landing() {

  const navigate = useNavigate();

  const handleSignUp = async () => {
    navigate(`/signup`);
  }

  const handleLogin = async () => {
    navigate(`/login`);
  }

  return (

    <div className="landing-page">
      <div className="background-image"></div>
      <div className="landing-layout">
      <div className="intro-auth">

      <section className="intro-section">
        <div className="intro-content">
          <h1 className="title-masked"> <img src="/icon2.png" className="logo-icon" />Astra AI</h1>
          <h1 className = "tagline"> <span style={{ color: "#f2f3f9" }}>Stop researching | </span>Start building </h1>
        </div>

        <p className="intro-about">
        AstraAI is an AI-assisted project planning and execution workspace 
        designed for developers who want to build projects themselves 
        rather than have AI build them for them.
        </p>

      </section>

      <section className="auth1">
        <h1 className="auth-title">Let's get started!</h1>
        <div className="auth-buttons">
          <button className="signup-btn" onClick={handleSignUp}>Sign Up</button>
          <button className="login-btn" onClick={handleLogin}>Log In</button>
        </div>
      </section>

      </div>

      
      <p className="intro-about2">Turn months of scattered research into <span style={{color: "#ff5fd1"}}>a structured workspace</span></p>

      <section className="problem-section">
          
          <div className="problem">
          <h1 className="problem-title">Research Hell</h1>
          <div className="problem-lines">
            <p>Should I use Express or Serverless?</p>
            <p>Supabase or MongoDB?</p>
            <p>Fine-tune a model or use inference APIs?</p>  
          </div>
          </div>

          <div className="problem">
          <h1 className="problem-title">Tutorial Hell</h1>
          <div className="problem-lines">
            <p>Every tutorial is a different stack.</p>
            <p>What do I learn first?</p>
            <p>Why is everything conflicting?</p>
            
          </div>
          </div>

          <div className="problem">
          <h1 className="problem-title">Feature Creep</h1>
          <div className="problem-lines">
            <p>What features to implement?</p>
            <p>When to add them?</p>
            <p>How to prioritize them?</p>
          </div>
          </div>

          <div className="problem">
          <h1 className="problem-title">Architecture Decisions</h1>
          <div className="problem-lines">
            <p>What architecture to choose?</p>
            <p>Why are there so many options?</p>
            <p>How to make the right choice?</p>
          </div>
          </div>

        </section>


        <h2 className="intro-about3">
          You don’t need more information. You need <span style={{color: "#a06bff"}}>direction.</span>
        </h2>

        <section className="types-section">
          <h1 className="types-title">Supported Project Types</h1>
              <div className="types-container">
              <div>
              <div className="type"><p className="type-label"><img src="/icon5.png" className="types-icon" /> Web Development</p></div>
              <div className="type"><p className="type-label"><img src="/icon13.png" className="types-icon" />AI / ML</p></div>
              </div>
              <div>
              <div className="type"><p className="type-label"><img src="/icon3.png" className="types-icon" /> Computer Vision</p></div>
              <div className="type"><p className="type-label"><img src="/icon8.png" className="types-icon" />Robotics</p></div>
              </div>
              <div>
              <div className="type"><p className="type-label"><img src="/icon7.png" className="types-icon" />Databases</p></div>
              <div className="type"><p className="type-label"><img src="/icon12.png" className="types-icon" /> Software Engineering</p></div>
              </div>
              </div>
        </section>


        <section className="flowchart-section">
          <h1 className="flow-title">How Astra AI works?</h1>
          
          <LandingFlow/>
        </section>

        <h2 className="intro-about2">
          Build with a plan!
        </h2>

        
        <section className="benefits-section">

          <h1 className="benefit-title">Astra AI helps you</h1>
          <div className="benefit-lines-container">
            <div>
            <p className="benefit-lines">Define scope</p>
            <p className="benefit-lines">Choose features</p>
            </div>
            <div>
            <p className="benefit-lines">Understand tradeoffs</p>
            <p className="benefit-lines">Choose stack</p>
            </div>
            <div>
            <p className="benefit-lines">Understand architecture</p>
            <p className="benefit-lines">Discover risks</p>
            </div>
          </div>
          
        </section>

        <section className="reward-section">
          <h1 className="reward-title">Complete your project and Unlock</h1>
          <div className="reward-cards">
            <div className="card"><h1 className="card-name">Readme File</h1><p>Auto-generated & customized for your project</p><img src="/icon11.png" className="reward-icon" /></div>
            <div className="card"><h1 className="card-name">CV Bullets</h1><p>Ready-made ATS-friendly bullet points for your CV</p> <img src="/icon10.png" className="reward-icon" /></div>
            <div className="card"><h1 className="card-name">Interview Pitch</h1><p>Practice explaining your project clearly for interviews</p> <img src="/icon4.png" className="reward-icon" /></div>
            <div className="card"><h1 className="card-name">Project Q&A</h1><p>Tailored to your architecture, stack choices, and decisions.</p> <img src="/icon9.png" className="reward-icon" /></div>
          </div>
          
        </section>

        
        <section className="auth2">
        <h1 className="auth-title2">Start Building Now!</h1>
        <div className="auth-buttons">
          <button className="signup-btn" onClick={handleSignUp}>Sign Up</button>
          <button className="login-btn" onClick={handleLogin}>Log In</button>
        </div>
      </section>
      
    <h1 className="credits">Made with absolute love: Rahma Rizk 💕</h1>  
    <h1 className="credits">All icons by <a href="https://icons8.com" style={{ color: "#ff5fd2bd" }}>Icons8</a></h1>
    </div>
    </div>
  );
}

export default Landing;
