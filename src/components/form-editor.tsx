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

import { Grid, Paper, Alert, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem, Stepper, Typography, Step, Button, StepButton } from "@mui/material";
import { useAppSelector } from "../state/hooks";
import { SectionEditor } from "./section-editor";
import { useState } from "react";
import { shallowEqual } from "react-redux";
import { Notebook } from "../state/initial";

export const FormEditor = ({ viewSetId }: {viewSetId: string}) => {

    const viewSet = useAppSelector((state: Notebook) => state['ui-specification'].viewsets[viewSetId],
        (left, right) => {
            return shallowEqual(left, right);
        });
    const views = useAppSelector((state: Notebook) => state['ui-specification'].fviews);

    console.log('FormEditor', viewSetId);

    const [activeStep, setActiveStep] = useState(0);

    const handleReset = () => {
        setActiveStep(0);
    };

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    return (
        <Grid container spacing={2}>

            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Stepper nonLinear activeStep={activeStep} alternativeLabel sx={{ my: 3 }}>
                            {viewSet.views.map((view: string, index: number) => (
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
                                <SectionEditor viewId={viewSet.views[activeStep]} viewSetId={viewSetId} />
                            )
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}