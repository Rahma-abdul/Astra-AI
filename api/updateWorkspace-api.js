import supabaseAdmin from "./supabaseAdmin.js";


export default async function handler(req, res) {
    
    // console.log("updateWorkspace API started");
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Only POST requests allowed."
        });
    }


    try{
        const {
            ws_id,
            status,
            updated_at, 
            action
        } = req.body;


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

        
        if (action === "deleteAccount"){
            // 1st delete all his ws 
            const {error: deleteError} = await supabaseAdmin
            .from("workspaces")
            .delete()
            .eq("user_id", user.id);

            if (deleteError){
                console.error(deleteError);
                return res.status(500).json({error: "Failed to delete user's workspaces!"});
            }

            // 2nd delete account
            const {error: accountError} = await supabaseAdmin
                .from("users")
                .delete()
                .eq("id", user.id);

            if (accountError){
                console.error(accountError);
                return res.status(500).json({
                    error:"Failed to delete user account!"
                })
            }

            // Delete Supabase auth account
            const {error: authDeleteError} = 
                await supabaseAdmin.auth.admin.deleteUser(user.id);
            
            if(authDeleteError){
                console.error(authDeleteError);

                return res.status(500).json({
                    error: "Failed to delete authentication account."
                });
            }

            return res.status(200).json({
                success: true
            });

        }
        else {
            if (!ws_id || !status || !updated_at) {
            return res.status(400).json({ error: "Missing required fields" });
            }
            // Update WS in DB --> ONLY Status and Updated_at fields
            const { error: updateError } = await supabaseAdmin
                .from("workspaces")
                .update({
                    status: status,
                    updated_at: updated_at
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

            res.status(200).json({success: true});
    }


    } catch (error) {
        
        return res.status(500).json({
            error:error.message
        });
        // We also need to be extra sure in case all the api fails so we wrap everything in try catch
        // res.status(500).json({ error: "Internal Server Error", details: error.message });
    }


    
}
