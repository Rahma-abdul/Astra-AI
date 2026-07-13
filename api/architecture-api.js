// This file defines a serverless HTTP endpoint for create workspace page
//  TO DO: Add Modification of arch review

import { GoogleGenAI } from "@google/genai";


export default async function handler(req ,res){
    
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Only POST requests are allowed."
        });
    }


    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });
    

    try{

        const { workspaceName, projectIdea, features, scope , feasibility} = req.body;

        // Role, Context, Task, Output Format, Constraints Prompt
        const prompt = `
            You're an experienced senior software developer, Analyze the following project:
            Project Name: ${workspaceName}
            Project Idea: ${projectIdea}
            Selected Features: ${features}
            Project Goal: ${scope.goal}
            Project Timeline: ${scope.timeline}
            Project Budget: ${scope.budget}
            Focus Areas: ${scope.focusAreas.join(", ")}
            Complexity: ${feasibility.complexity}
            Duration in hours: ${feasibility.duration}
            Possible Risks: ${feasibility.possibleRisks.join(", ")}

            1) Recommend the best overall architecture for this project based on the provided information.
            Possible architectures include (but are not limited to): Monolithic Backend, Microservices, Serverless, Event-Driven, Layered (N-Tier), Space-Based, Microkernel (Plug-in), Service-Oriented Architecture (SOA), Client-Server, Peer-to-Peer (P2P), Model-View-Controller (MVC), Component-Based, Pipe-and-Filter, Blackboard, and Broker.

            2) Suggest the most suitable tech stack for this project, considering factors such as programming languages, frameworks, libraries, databases, and any other relevant technologies.
            Tech stack suggestions should be based on the project's requirements, complexity, and scope.
            For: Frontend, Backend, Database, DevOps (if applicable), Authentication, AI Framework (if applicable), Deployment, Storage (if applicable) and any other relevant categories.
            
            3) Provide a detailed explanation of why this recommended architecture and tech stack is the best fit for this project, considering factors such as scalability, maintainability, performance, and cost-effectiveness.

            4) Suggest 3-5 alternative architectures that could also be suitable for this project.

            5) For every stack category you include, recommend exactly one technology and provide 3–5 alternatives.

            Requirements: 
            - Return ONLY valid JSON
            - No markdown 
            - No explanations outside JSON
            - No code fences 
            - Never recommend technologies that are not suitable for this project based on the provided information.
            - Prefer free/open-source technologies when budget is "Free Tier" or Limited (if possible).
            - Prefer beginner-friendly technologies when complexity is "Beginner" or "Intermediate" (if possible).
            - If AI isn't required, don't recomment AI frameworks or libraries.
            - You're not forced to recommend every stack category, if it's not applicable to this project based on the provided information don't include it.
            - Do not force technologies into the solution if they provide no value
            - Use concise category names for the stacks, Examples: Frontend, Backend, Database, Authentication, AI Framework, 
                Deployment, Storage, DevOps, Testing, CI/CD, Containerization, 
                Monitoring, Caching, Message Queue, Computer Vision, Data Analysis, Robotics


            - Return in this EXACT format:
            {
                "recommendedArchitecture": "",

                "alternativeArchitectures": [],

                "stack": [
                {
                    "category": "Ex: Frontend, Backend ... etc",
                    "recommended": "",
                    "alternatives": []}
                ] , 

                "why": ""
        }

        `;


        const response = await ai.models.generateContent({
            model:"gemini-2.5-flash" ,
            contents: prompt
        });



        const text = response.text.replace(/```json/g,"").replace(/```/g,"").trim();

        const json = JSON.parse(text);

        return res.status(200).json(json);

    }
    catch(err){
        console.error(err);

        return res.status(500).json({
            // error: "Failed to generate features."
            error: err.message,
            stack: err.stack,
        });

    }
}
