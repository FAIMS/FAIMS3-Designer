import { Accordion, AccordionDetails, AccordionSummary, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { FieldList } from "./field-list";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../state/hooks";
import { shallowEqual } from "react-redux";

export const SectionEditor = ({viewId}) => {

    const fView = useAppSelector(state => state['ui-specification'].fviews[viewId]);
    const metadata = useAppSelector(state => state.metadata);
    const dispatch = useAppDispatch();

    // roles that can be used to access this form
    const roles = useAppSelector(state => state.metadata.accesses, shallowEqual) as string[];
 
    const [state, setState] = useState({
        inheritAccess: true,
        access: ['admin'],
        label: fView.label
    })

    const updateProperty = (prop: string, value: any) => {
        const newState = {...state, [prop]: value};
        setState(newState); 
    };

    console.log('SectionEditor', viewId);

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
                                {roles.map((role: string, index: number) => {
                                    return (
                                        <MenuItem key={index} value={role}>{role}</MenuItem>
                                    )
                                })}
                        </Select>
                        </FormControl>
                    </Grid>
                )
                }
            </Grid>


            <FieldList viewId={viewId} />
        </AccordionDetails>
    </Accordion>
    );
}