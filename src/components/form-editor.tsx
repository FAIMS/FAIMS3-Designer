import { Grid, Paper, Alert, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../state/hooks";
import { SectionEditor } from "./section-editor";
import { useState } from "react";
import { shallowEqual } from "react-redux";

export const FormEditor = ({viewSetId}) => {

    const viewSet = useAppSelector(state => state['ui-specification'].viewsets[viewSetId], 
                                    (left, right) => {
                                        console.log('CMP FormEditor', viewSetId, left, right, shallowEqual(left, right));
                                        return shallowEqual(left, right);
                                    });
   // const metadata = useAppSelector(state => state.metadata);
    //const dispatch = useAppDispatch();

    const [state, setState] = useState({
        inheritAccess: true,
        access: ['admin'],
        annotation: true,
        uncertainty: true
    })

    const updateProperty = (prop: string, value: any) => {
        const newState = {...state, [prop]: value};
        setState(newState); 
    };
    
    console.log('FormEditor' , viewSetId);
    return (
        <Grid container spacing={2}>

        <Grid item xs={12}>
        <Paper elevation={3}>

            <Alert severity="info">Configure who can access this form.</Alert>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <FormControlLabel required 
                    control={<Checkbox 
                                checked={state.inheritAccess}
                                onChange={(e) => updateProperty('inheritAccess', e.target.checked)} 
                                />} label="Inherit Access from Notebook" />
                </Grid>

                {!state.inheritAccess && 
                (
                    <Grid item sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Roles with access</InputLabel>
                            <Select 
                            name="access" 
                            multiple
                            label="Roles with access"
                            value={state.access}
                            onChange={(e) => updateProperty('access', e.target.value)}
                            >
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="team">Team</MenuItem>
                        </Select>
                        </FormControl>
                    </Grid>
                )
                }
            </Grid>

            <Alert severity="info">Configure annotation and uncertainty options 
                                for all fields in this form.</Alert>
            <Grid container spacing={2}>

                    <Grid item sm={6}>
                        <FormControlLabel required 
                        control={<Checkbox 
                                    checked={state.annotation}
                                    onChange={(e) => updateProperty('annotation', e.target.checked)} 
                                    />} label="Enable Annotation" />
                    </Grid>

                    <Grid item sm={6}>
                        <FormControlLabel required 
                        control={<Checkbox 
                                    checked={state.uncertainty}
                                    onChange={(e) => updateProperty('uncertainty', e.target.checked)} 
                                    />} label="Enable Uncertainty" />
                </Grid>
            </Grid>
        </Paper>
        </Grid>

        <Grid item xs={12}>
        {viewSet.views.map((view: any) => {
            // Each fView defines a Page in the form
            return (<SectionEditor key={view} viewId={view} />)
        })}
        </Grid>
        </Grid>
    );
}