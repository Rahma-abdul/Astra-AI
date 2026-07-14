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

        const { workspaceName, projectIdea, features, scope , feasibility , mode , orgArch , orgStack , selectedArch , selectedStack} = req.body;

        let prompt = "";

        if (mode === "generate") {
        // Role, Context, Task, Output Format, Constraints Prompt
        prompt = `
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

            5) For every stack category you include, recommend exactly one technology and provide 3–5 alternatives that are fully compatible with:
                - the recommended architecture 
                - the recommended technologies in other categories
                - the project's requirements, complexity, and scope
                - the alternative architectures you suggested (if applicable)
            
            6) Assume the user may replace any single category with one of its alternatives while leaving the rest unchanged. Every suggested alternative must be fully compatible with the recommended architecture and the other recommended technologies in their respective categories. 
            Every suggest alternative must still produce a valid and practical overall stack
            If an alternative is not compatible, do not include it.

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
        }

        else if (mode === "review") {
            prompt = `
            You're an experienced senior software developer, Analyzing the following project:
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

            The user modified the AI-generated recommendation.

            Review the FINAL selected architecture and stack.

            Determine whether the selected technologies work well together.

            Consider:

            compatibility
            scalability
            deployment
            ecosystem support
            developer experience
            project requirements

            Original Architecture Recommended: ${orgArch}
            Original Stack Recommended: ${JSON.stringify(orgStack)}

            The user modified them to:
            Selected Architecture: ${selectedArch}
            Selected Stack: ${JSON.stringify(selectedStack)}


            If everything is valid return JSON in the following format: 
            {
                "valid": true,
            }

            If improvements are needed, return JSON in the following format:
            {
                "valid": false,
                "suggestions": [
                    {
                        "category": "Ex: Frontend",
                        "current": "Ex: React",
                        "suggested": "Ex: Vue.js",
                        "reason": "Ex: Vue.js has better compatibility with the selected backend framework."

                    }
                ]       
            }

            VERY IMPORTANT:
            - Only suggest changes that are actually necessary for compatibility or improvement.
            - Do not suggest changes for personal preference or subjective reasons.
            - Do not suggest changes that are not relevant to the project requirements, complexity, and scope.
            - If 90% of the stack is compatible and only one or two categories have minor issues, do not suggest changing the entire stack. Focus on the specific categories that need improvement.
            - If the selected architecture is not compatible with the selected stack, suggest a more compatible architecture that still meets the project requirements, complexity, and scope.
            - Keep every "reason" field to 2 sentences, maximum 40 words.
            - "current" and "suggested" fields must be plain strings, never objects.
            - "category" must match one of the category names in the selected stack exactly.

            Return ONLY JSON


            `;

        }

        else {
            return res.status(400).json({
                error: "Invalid mode."
            });
        }


        const response = await ai.models.generateContent({
            model:"gemini-2.5-flash" ,
            contents: prompt ,
            config:{ responseMimeType: "application/json"}
        });


        console.log("RAW RESPONSE:");
        console.log(response.text);

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
