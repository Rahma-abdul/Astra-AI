import supabaseAdmin from "./supabaseAdmin.js";
import { GoogleGenAI } from "@google/genai";



export default async function handler(req, res) {
    
    // console.log("unlocked API started");

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Only POST requests allowed."
        });
    }

    const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
    });


    try{
        const {ws_id , type} = req.body;

        if (!ws_id || !type) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No authorization token" });
        }

        const token = authHeader.substring(7); 

        // Verify token and get user
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        // Load WS
        const { data: workspaceData, error: fetchError } = await supabaseAdmin
            .from("workspaces")
            .select("*")
            .eq("id", ws_id)
            .eq("user_id", user.id)
            .single();

        if (fetchError || !workspaceData) {
            return res.status(404).json({ error: "Workspace not found" });
        }

        
        // Already generated
        if(workspaceData.docs && Object.keys(workspaceData.docs).length > 0){
            // console.log("already generated");
            // console.log(workspaceData.docs[type]);
            return res.status(200).json({ data: workspaceData.docs[type]});
        }

        // If not generated
        const prompt = `
            You are a senior software engineer. Generate FOUR things for the following project.

            Project Name: ${workspaceData.ws_name}
            Project Overview and Tasks that were done: ${JSON.stringify(workspaceData.content)}
            Features: ${JSON.stringify(workspaceData.features)}
            Architecture and Stack: ${JSON.stringify(workspaceData.arch_stack)}

            Return ONLY valid JSON.
            Format:
            {
            "readme":"",
            "cvBullets":[
            "",
            "",
            "",
            "",
            ""
            ],
            "interviewPrep":[
                {
                "question":"",
                "answer":""
                }
            ],
            "qaGuide":[
                {
                "question":"",
                "answer":""
                }
            ]
            }

            Rules:

            README:
            - Professional GitHub README (No Emojis)
            - Markdown
            - Include installation
            - Include project overview
            - Include project architecture
            - Include features
            - Include tech stack
            - Never invent repository names.
            - Never invent folder structures.
            - If information is unavailable, omit it.
            - Use only the project information provided.
            - Leave placeholders only when absolutely necessary.

            CV Bullets:
            - Exactly 5 resume bullets
            - ATS friendly
            - Only quantify if the project description explicitly contains measurements. (Quantified where possible)

            Interview Prep:
            - Generate questions an interviewer is likely to ask AFTER seeing this project.
            - 15 interview questions
            - Begin with:
                - elevator pitch
                - motivation
                - architecture
            Then move into:
                - implementation
                - tradeoffs
                - debugging
                - scaling
            - More about the project and less technicalities
            - Questions should progressively become deeper.
            - Detailed answers

            QA Guide:
            - 15 technical project questions
            - Concise answers
            - Questions about the programming, architecture, stack, etc
            - Why this way? Why not that way? 

            Return ONLY JSON.
`;

       
        const response = await ai.models.generateContent({
            model:"gemini-3.6-flash" ,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });


        const text = response.text.replace(/```json/g,"").replace(/```/g,"").trim();

        const generated = JSON.parse(text);


        // Save to DB
        const { error: updateError } = await supabaseAdmin
            .from("workspaces")
            .update({
                docs: generated
            })
            .eq("id", ws_id)
            .eq("user_id", user.id);

        if (updateError) {
            console.error(updateError);
             return res.status(500).json({
                    error: updateError.message
                });
            // return res.status(500).json({ error: "Failed to insert workspace" });
        };

        return res.status(200).json({data: generated[type]});


    } catch (error) {
        
        return res.status(500).json({
            error:error.message
        });
        // We also need to be extra sure in case all the api fails so we wrap everything in try catch
        // res.status(500).json({ error: "Internal Server Error", details: error.message });
    }


    
}
