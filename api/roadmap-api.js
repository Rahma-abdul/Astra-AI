// This file defines a serverless HTTP endpoint for create workspace page

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

        const { projectIdea, features, scope , feasibility, architecture} = req.body;

       
        const prompt = `
            You're an experienced senior software developer and technical mentor, Analyze the following project:
            Project Idea: ${projectIdea}
            Features: ${features}
            Project Goal: ${scope.goal}
            Project Timeline: ${scope.timeline}
            Focus Areas: ${scope.focusAreas.join(", ")}
            Complexity: ${feasibility.complexity}
            Architecture: ${architecture.selectedArchitecture}
            Tech Stack: ${architecture.selectedStack
                .map(s => `${s.category}: ${s.selected}`)
                .join(", ")}

            Create a dependency-based implementation roadmap.
            The roadmap should NOT be simple and it should NOT blindly and simply repeat the checklist

            Instead, determine: 
            - What should be done first?
            - What tasks can be done independently/in parallel?
            - What tasks depend on previous tasks?
            - Which tasks require multiple previous tasks to be completed?

            Rules:
            - Include a Start/Setup node
            - Generate realistic implementation steps from beginning to end
            - Prefer 15/30 roadmap nodes (Make it thorough)
            - Each node should represent a meaningful develpment milestone
            - Keep node labels short and clear (2-4 words MAX)
            - Do not include tiny coding actions 
            - Do not invent technologies outside selected stack
            - A node may have mutliple incoming and/or outgoing dependencies
            - Do not creat unnecessary dependencies
            - Independent tasks should be allowed to branch
            - If task requires multiple previous tasks, create multiple incoming edges 
            - The roadmap should eventually converge toward a completed project
            - ONLY create edges when there's a TRUE DEPENDENCY, not for logical flow
            - AVOID creating more than 2-3 edges per node
            - AVOID long chains - create parallel paths instead

            Return ONLY valid JSON

            Format: 
                {
                "nodes": [
                    {
                        "id": "",
                        "label": ""
                    }
                ],

                "edges": [
                    {
                        "source": "",
                        "target": ""
                    }
                ]
            }
        `;

       

        const response = await ai.models.generateContent({
            model:"gemini-3.5-flash-lite" ,
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
