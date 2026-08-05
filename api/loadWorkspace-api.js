import supabaseAdmin from "./supabaseAdmin.js";


export default async function handler(req, res) {
    
    // console.log("loadWorkspace API started");

    if (req.method !== "GET") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }


    try{
        const {id} = req.query;

        if (!id) {
            return res.status(400).json({ error: "Missing required ID" });
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

        // Get WS from DB
        const { data: workspaceData, error: loadError } = await supabaseAdmin
            .from("workspaces")
            .select("*")
            .eq("id", id)
            .eq("user_id", user.id)
            .single();

        if (loadError) {
            console.error(loadError);
            return res.status(404).json({
                error: loadError.message
            });
        }

        res.status(200).json(workspaceData);


    } catch (error) {
        
        return res.status(500).json({
            error: error.message
        });
        // We also need to be extra sure in case all the api fails so we wrap everything in try catch
        // res.status(500).json({ error: "Internal Server Error", details: error.message });
    }


    
}
