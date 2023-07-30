import { Alert, Button, Divider, List, ListItem, ListItemText, Paper, TextField } from "@mui/material";
import { useEffect, useState } from "react";

/**
 * RolesPanel - edit the user roles associated with this notebook
 * which are stored in the "accesses" property in the metadata
 * @param param0 
 * @returns 
 */
export const RolesPanel = ({initial, updateHandler}) => {

    const [accesses, setAccesses] = useState(initial.accesses);
    const [newAccess, setNewAccess] = useState('');

    const addRole = () => {
        accesses.push(newAccess)
        setAccesses(accesses);
        updateHandler({...initial, accesses: accesses});
        setNewAccess('');
    };

    return (
        <>
        <h2>User Roles</h2>

        <Alert severity="info">All projects have an admin, moderator, and team 
        roles by default. define any new roles required here. 
        You will be able to assign users to these roles later 
        in the User tab.</Alert>

        <TextField 
            label="New Role" 
            value={newAccess}
            onChange={(e) => setNewAccess(e.target.value)} />
        <Button onClick={addRole}>Add Role</Button>

        <List>
            {accesses.map((access : string) => {
                return (
                    <Paper key={access}>
                    <ListItem key={access}>
                        <ListItemText primary={access} />
                    </ListItem>
                    <Divider />
                    </Paper>
                )
            })}
        </List>
        </>
    )
}