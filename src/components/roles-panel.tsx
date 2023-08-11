import { Alert, Button, Divider, IconButton, List, ListItem, ListItemText, Paper, TextField } from "@mui/material";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../state/hooks";
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * RolesPanel - edit the user roles associated with this notebook
 * which are stored in the "accesses" property in the metadata
 */
export const RolesPanel = () => {

    const roles = useAppSelector(state => state.metadata.accesses) as string[];
    const dispatch = useAppDispatch();

    const [newRole, setNewRole] = useState('');

    const addRole = () => {
        const newRoles = [...roles, newRole];
        dispatch({
            type: 'metadata/rolesUpdated', 
            payload: {roles: newRoles}
        })
        setNewRole('');
    };

    const removeRole = (role: string) => {
        const newRoles = roles.filter((r) => r !== role);
        dispatch({
            type: 'metadata/rolesUpdated', 
            payload: {roles: newRoles}
        });
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
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)} />
        <Button onClick={addRole}>Add Role</Button>

        <List>
            {roles.map((access : string) => {
                return (
                    <Paper key={access}>
                    <ListItem 
                            key={access}
                            secondaryAction={
                                <IconButton 
                                    edge="end" 
                                    aria-label="delete"
                                    onClick={() => removeRole(access)}>
                                <DeleteIcon />
                                </IconButton>
                            }>
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