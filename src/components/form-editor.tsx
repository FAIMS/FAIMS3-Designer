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

import { Grid, Paper, Alert, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem, Box, Stepper, Typography, Step, Button, StepButton, StepContent } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../state/hooks";
import { SectionEditor } from "./section-editor";
import { useState } from "react";
import { shallowEqual } from "react-redux";

export const FormEditor = ({ viewSetId }) => {

    const viewSet = useAppSelector(state => state['ui-specification'].viewsets[viewSetId],
        (left, right) => {
            return shallowEqual(left, right);
        });
    // const metadata = useAppSelector(state => state.metadata);
    //const dispatch = useAppDispatch();
    const views = useAppSelector(state => state['ui-specification'].fviews);

    const [state, setState] = useState({
        inheritAccess: true,
        access: ['admin'],
        annotation: true,
        uncertainty: true
    })

    const updateProperty = (prop: string, value: any) => {
        const newState = { ...state, [prop]: value };
        setState(newState);
    };

    console.log('FormEditor', viewSetId);

    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    return (
        <Grid container spacing={2}>

            <Grid item xs={12}>
                <Paper elevation={3}>

                    <Alert severity="info">Configure who can access this form.</Alert>

                    <Grid container spacing={2}>
                        <Grid item sm={6}>
                            <FormControlLabel
                                required
                                sx={{ pl: 1.5 }}
                                control={<Checkbox
                                    checked={state.inheritAccess}
                                    onChange={(e) => updateProperty('inheritAccess', e.target.checked)}
                                />}
                                label="Inherit Access from Notebook" />
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
                            <FormControlLabel
                                required
                                sx={{ pl: 1.5 }}
                                control={<Checkbox
                                    checked={state.annotation}
                                    onChange={(e) => updateProperty('annotation', e.target.checked)}
                                />}
                                label="Enable Annotation" />
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
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Stepper nonLinear activeStep={activeStep} alternativeLabel sx={{ my: 3 }}>
                            {viewSet.views.map((view: any, index: number) => (
                                <Step key={view}>
                                    <StepButton color="inherit" onClick={handleStep(index)}>
                                        <Typography>{views[view].label}</Typography>
                                    </StepButton>
                                </Step>
                            ))}
                        </Stepper>
                    </Grid>
                    <Grid item xs={12}>
                        {activeStep === viewSet.views.length ? (
                            <Paper square elevation={0} sx={{ p: 3 }}>
                                <Alert severity="success">All steps completed - you're finished.</Alert>
                                <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                                    Go back to the beginning
                                </Button>
                            </Paper>
                        ) :
                            (
                                <SectionEditor viewId={viewSet.views[activeStep]} />
                            )
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}