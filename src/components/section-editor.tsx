import { Accordion, AccordionDetails, AccordionSummary, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { FieldList } from "./field-list";
import { useState } from "react";

export const SectionEditor = ({fView, fields, updateField}) => {

    const [state, setState] = useState({
        inheritAccess: true,
        access: ['admin'],
        label: fView.label
    })

    const updateProperty = (prop: string, value: any) => {
        const newState = {...state, [prop]: value};
        setState(newState); 
    };

    return (
    <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>Section: {state.label}</AccordionSummary>
        <AccordionDetails>

        <Grid container spacing={2}>

            <Grid item sm={6}>
                <TextField
                    fullWidth
                    required
                    label="Page Name"
                    helperText="Name for this page of the form"
                    name="label"
                    data-testid="label"
                    value={state.label}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        updateProperty('label', event.target.value);
                    }}
                />
            </Grid>

            <Grid item sm={6}>
                <FormControlLabel required 
                control={<Checkbox 
                            checked={state.inheritAccess}
                            onChange={(e) => updateProperty('inheritAccess', e.target.checked)} 
                            />} label="Inherit Access from Form" />
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


            <FieldList fView={fView} fields={fields} updateField={updateField}/>
        </AccordionDetails>
    </Accordion>
    );
}