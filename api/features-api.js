// This file defines a serverless HTTP endpoint for create workspace page

import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY
// });

export default async function handler(req ,res){
    
    // if (req.method !== "POST") {
    //     return res.status(405).json({
    //         error: "Only POST requests are allowed."
    //     });
    // }

    // console.log(process.env);
    // console.log(process.env.GEMINI_API_KEY);
    console.log("Before AI created");

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });
    
    console.log("AI created");

    try{

        const {projectName , idea} = req.body;

        // Role, Context, Task, Output Format, Constraints Prompt
        const prompt = `
            You're a senior software developer, A developer has the following project:
            Project Name: ${projectName}
            Project Idea: ${idea}
            Extract the features in this project, both the obvious ones and the possibly helpful and relatable ones
            Requirements: 
            - Return ONLY valid JSON
            - No markdown 
            - No explanations
            - No code fences 
            - Return AT LEAST 8 features 
            - Return in in this exact format:
                {
                "features":[
                    {
                        "id":1,
                        "name":""
                    }
                ]
                }
            - Generate between 3 to 5 obvious features
            - Generate between 1 to 3 helpful relatable features
            - Descriptions should be AT MOST 5 words
            
        `;

         console.log("Calling ai");

        const response = await ai.models.generateContent({
            model:"gemini-2.5-flash" ,
            contents: prompt
        });

         console.log("AI replied");


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
