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

        const { 
                projectIdea, 
                features,  
                architecture} = req.body;

        const prompt = `
            You are a senior software architect.

            Based on the selected architecture, features and technology stack, generate a simple high-level architecture diagram.
            Project idea:  ${projectIdea}
            Selected Architecture: ${architecture.selectedArchitecture} 
            Selected Tech Stack: ${architecture.selectedStack
                .map(s => `${s.category}: ${s.selected}`)
                .join(", ")}
            Features: ${features.join(", ")}

            Rules:

            - Maximum 6-8 layers.
            - Each layer contains 1-4 components.
            - Keep component names short (under 4 words).
            - Use technologies from the selected stack.
            - Only include major services (simple designs).
            - Do not invent unnecessary microservices.
            - Do NOT include implementation details.
            - If Serverless is selected, use API Functions instead of Backend Server.
            - If Full Stack is selected, include Backend API.
            - If AI is involved, include an AI Service layer.
            - If Authentication exists, include Authentication.
            - If Storage exists, include Storage.
            
            Return JSON ONLY.

            Return

        {
        "layers":[
            {
                "nodes":[ {"label":"Frontend (React)"} ]
            }
        ]
        }
        `;


        const response = await ai.models.generateContent({
            model:"gemini-2.5-flash-lite" ,
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
