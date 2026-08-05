// import supabaseAdmin from "./supabaseAdmin";
import supabaseAdmin from "./supabaseAdmin.js";


export default async function handler(req, res) {
    
    // console.log("saveWorkspace API started");

    try{
        const {
            ws_name,
            content,
            features,
            arch_stack,
            archmap,
            roadmap,
            status,
            updated_at
        } = req.body;

        if (!ws_name || !content || !features || !arch_stack || !archmap || !roadmap) {
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

        // Insert WS in DB
        const { data: workspaceData, error: insertError } = await supabaseAdmin
            .from("workspaces")
            .insert({
                user_id: user.id,
                ws_name: ws_name,
                content: content,
                features: features,
                arch_stack: arch_stack,
                archmap: archmap,
                roadmap: roadmap,
                status: status,
                updated_at: updated_at
            })
            .select();

        if (insertError) {
            console.error(insertError);
             return res.status(500).json({
                    error: insertError.message
                });
            // return res.status(500).json({ error: "Failed to insert workspace" });
        };

       const wsID = workspaceData?.[0]?.id;

       if (!wsID) {
            return res.status(500).json({ error: "Workspace created but no ID returned" });
        }

        res.status(200).json({wsID});


    } catch (error) {
        
        return res.status(500).json({
            error:error.message
        });
        // We also need to be extra sure in case all the api fails so we wrap everything in try catch
        // res.status(500).json({ error: "Internal Server Error", details: error.message });
    }


    
}
