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

        const { workspaceName, projectIdea, features, scope} = req.body;

        // Role, Context, Task, Output Format, Constraints Prompt
        const prompt = `
            You're a senior software developer, Analyze the following project:
            Project Name: ${workspaceName}
            Project Idea: ${projectIdea}
            Selected Features: ${features}
            Project Goal: ${scope.goal}
            Project Timeline: ${scope.timeline}
            Project Budget: ${scope.budget}
            Focus Areas: ${scope.focusAreas.join(", ")}

            Estimate the feasibility of this project based on the provided information. 
            Include an estimation for the overall complexity and it must be from (Beginner, Intermediate, Advanced, Expert).
            and implementation duration estimation must be in total hours.
            and all the possible risks and challenges that might be faced during the implementation of this project.

            Requirements: 
            - Return ONLY valid JSON
            - No markdown 
            - No explanations
            - No code fences 
            - Return AT LEAST 4 concise risks and challenges 
            - DO NOT explain complexity or duration (If you need to explain them include them in the risks and challenges) 
            - Return in this exact format:
                            {
            "complexity":"",
            "duration":0,
            "possibleRisks":[]
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
