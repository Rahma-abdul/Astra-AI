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

        const { workspaceName, 
                projectIdea, 
                features,  
                scope, 
                feasibility, 
                architecture} = req.body;

        // Role, Context, Task, Output Format, Constraints Prompt
        const prompt = `
            You're an experienced senior software engineer and technical mentor.

            Analyze the following project.
            Project Name: ${workspaceName}
            Project Idea: ${projectIdea}
            Selected Features: ${features.join(", ")}
            Goal: ${scope.goal}
            Timeline: ${scope.timeline}
            Budget: ${scope.budget}
            Focus Areas: ${scope.focusAreas.join(", ")}
            Complexity: ${feasibility.complexity}
            Estimated Duration: ${feasibility.duration} hours
            Selected Architecture: ${architecture.selectedArchitecture}
            Selected Tech Stack:
            ${architecture.selectedStack
                .map(s => `${s.category}: ${s.selected}`)
                .join(", ")}

            Your tasks:

            1. Generate a professional project description.
            
            The description should:
            - Be 1-2 paragraphs MAX.
            - Expand on the user's idea.
            - Mention the project's goal.
            - Mention the selected features naturally.
            - Explain what the application does and who it is intended for.

            2. Recommend YouTube learning resources.
            
            Return 5-8 videos.
            For each video include:
            - title
            - creator
            Prefer:
            - freeCodeCamp.org
            - Traversy Media
            - Web Dev Simplified
            - The Net Ninja
            - Fireship
            - Hussein Nasser
            - Theo
            - Tech With Tim
            or another well-known creator.

            3. Recommend official documentation.

            Return 5-8 documentation resources.
            For each dpcument include:
            - title
            - source
            Prefer official documentation whenever possible and of relevant.
            Examples:
            React, Express, Supabase, OpenAI, Vercel, FastAPI, Docker, etc.

            4. Recommend articles or research papers.

            Return 3-5 high-quality articles or papers related to the project's domain or problem being solved.
            For each article include:
            - title
            - authors

            5. Generate a learning checklist.
            
            Return 10-15 learning topics.
            Topics should only be names.    
            Examples:
            React Hooks, JWT Authentication, REST APIs, Prompt Engineering, etc.

            6. Generate an implementation checklist.

            Return 20-40 implementation tasks.
            Tasks should be ordered from start to finish.
            Examples:
            Initialize React project, Create login page, Build authentication API, Deploy application

            Requirements:

            - Return ONLY valid JSON.
            - No markdown.
            - No explanations.
            - No code fences.
            - Use concise task names.
            - Prefer official documentation.
            - For each checklist item (whether learning or implementation) write ONLY topics
            - Recommend beginner-friendly resources when the project complexity is Beginner or Intermediate.
            - Do not invent technologies not used in the selected stack.
            - Recommend resources that directly help build THIS project.

            Return EXACTLY this format:

            {
                "overview": {
                    "projectDescription": ""
                },

                "learningResources": {
                    "videos": [
                        {
                            "title": "",
                            "creator": ""
                        }
                    ],

                    "documentation": [
                        {
                            "title": "",
                            "source": ""
                        }
                    ],

                    "articles": [
                        {
                            "title": "",
                            "authors": ""
                        }
                    ]
                },

                "checklist": {
                    "learningTopics": [],
                    "implementationTasks": []
                }
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
