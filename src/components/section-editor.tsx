import { Accordion, AccordionDetails, AccordionSummary, 
        Alert, 
        Button, 
        Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, 
        Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";


import { FieldEditor } from "./field-editor";
import { useState } from "react";
import { FieldList } from "./field-list";

export const SectionEditor = ({fView, viewSet, fields, updateField}) => {

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

    return (
    <Accordion>
        <AccordionSummary>Page: {fView.label}</AccordionSummary>
        <AccordionDetails>
        
        <Accordion>
        <AccordionSummary>Access</AccordionSummary>
        <AccordionDetails>

            <Alert level="info">Configure who can access this section 
            of the form.</Alert>

            <Grid item sm={6}>
                <FormControlLabel required 
                control={<Checkbox 
                            checked={state.inheritAccess}
                            onChange={(e) => updateProperty('inheritAccess', e.target.checked)} 
                            />} label="Inherit Access from Notebook" />
            </Grid>

            {!state.inheritAccess && 
             (
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
             )
            }
            </AccordionDetails>
        </Accordion>

        <Accordion>
        <AccordionSummary>Advanced</AccordionSummary>
        <AccordionDetails>
        <Alert severity="info">Configure annotation and uncertainty options 
        for all fields in this section.</Alert>

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
        </AccordionDetails>
        </Accordion>

        <Accordion>
            <AccordionSummary>Fields</AccordionSummary>
            <AccordionDetails>
                <FieldList fView={fView} fields={fields} updateField={updateField}/>
            </AccordionDetails>
        </Accordion>
    </AccordionDetails>
    </Accordion>
    );
}