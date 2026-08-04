import supabaseAdmin from "./supabaseAdmin.js";


export default async function handler(req, res) {
    
    console.log("deleteWorkspace API started");

    if (req.method !== "DELETE") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try{
        const {ws_id} = req.body;

        if (!ws_id) {
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

        // Delete WS in DB 
        const { error: deleteError } = await supabaseAdmin
            .from("workspaces")
            .delete()
            .eq("id", ws_id)
            .eq("user_id", user.id);
            

        if (deleteError) {
            console.error(deleteError);
             return res.status(500).json({
                    error: deleteError.message
                });
            // return res.status(500).json({ error: "Failed to insert workspace" });
        };

        res.status(200).json({success: true});


    } catch (error) {
        
        return res.status(500).json({
            error:error.message
        });
        // We also need to be extra sure in case all the api fails so we wrap everything in try catch
        // res.status(500).json({ error: "Internal Server Error", details: error.message });
    }


    
}
