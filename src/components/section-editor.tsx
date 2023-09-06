// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Accordion, AccordionDetails, AccordionSummary, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { FieldList } from "./field-list";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../state/hooks";
import { shallowEqual } from "react-redux";

export const SectionEditor = ({ viewId }) => {

    const fView = useAppSelector(state => state['ui-specification'].fviews[viewId]);
    // const metadata = useAppSelector(state => state.metadata);
    // const dispatch = useAppDispatch();

    // roles that can be used to access this form
    const roles = useAppSelector(state => state.metadata.accesses, shallowEqual) as string[];

    const [state, setState] = useState({
        inheritAccess: true,
        access: ['admin'],
        label: fView.label
    })

    useEffect(() => {
        setState({
            inheritAccess: true,
            access: ['admin'],
            label: fView.label
        });
    }, [fView]);

    const updateProperty = (prop: string, value: any) => {
        const newState = { ...state, [prop]: value };
        setState(newState);
    };

    console.log('SectionEditor', viewId);

    return (
        <>
    
                <Grid container spacing={2}>

                    <Grid item sm={12}>
                    <Typography variant='h3'>Section: {state.label}</Typography>
                    </Grid>
                    <Grid item sm={6} p={2}>
                        <TextField
                            fullWidth
                            required
                            label="Page Name"
                            helperText="Name for this page of the form."
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
            </>
    );
}