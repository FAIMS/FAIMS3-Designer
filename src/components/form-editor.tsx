// Copyright 2023 FAIMS Project
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

import { Grid, Paper, Alert, Stepper, Typography, Step, Button, StepButton, TextField, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { SectionEditor } from "./section-editor";
import { useState } from "react";
import { shallowEqual } from "react-redux";
import { Notebook } from "../state/initial";

export const FormEditor = ({ viewSetId }: { viewSetId: string }) => {

    const viewSet = useAppSelector((state: Notebook) => state['ui-specification'].viewsets[viewSetId],
        (left, right) => {
            return shallowEqual(left, right);
        });
    const views = useAppSelector((state: Notebook) => state['ui-specification'].fviews);
    const fields = useAppSelector((state: Notebook) => state['ui-specification'].fields);
    const dispatch = useAppDispatch();

    console.log('FormEditor', viewSetId);
    
    const [activeStep, setActiveStep] = useState(0);
    const [newSectionName, setNewSectionName] = useState('New Section');
    const [alertMessage, setAlertMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [deleteAlertMessage, setDeleteAlertMessage] = useState('');
    const [deleteAlertTitle, setDeleteAlertTitle] = useState('');
    const [preventDeleteDialog, setPreventDeleteDialog] = useState(false);

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const addNewSection = () => {
        try {
            dispatch({ type: 'ui-specification/formSectionAdded', payload: { viewSetId: viewSetId, sectionLabel: newSectionName } });
        } catch (error: unknown) {
            error instanceof Error &&
                setAlertMessage(error.message);
        }
    }

    const deleteConfirmation = () => {
        setOpen(true);
        setPreventDeleteDialog(false);
        setDeleteAlertTitle("Are you sure you want to delete this form?");
        setDeleteAlertMessage("You will lose all your progress.");
    }

    const preventFormDelete = () => {
        // we dont need the field names, only their values
        const fieldValues = Object.values(fields)
        let flag: boolean = false;
        // search through all the values for mention of the form to be deleted in the related_type param
        fieldValues.map((fieldValue) => {
            if (fieldValue["component-parameters"].related_type === viewSetId) {
                flag = true;
                
                // extracting the name of the field to advise user
                const relatedFieldName = fieldValue["component-parameters"].name;

                // extracting where in the notebook the user has to look
                const fviewsEntries = Object.entries(views)
                fviewsEntries.map((fviewId, idx) => {
                    // accessing the first element of the subarray only because it holds all the info
                    fviewsEntries[idx][1].fields.map((field) => {
                        // finding the form+section relatedFieldname belongs to
                        if(field === relatedFieldName) {
                            // setting the dialog text here
                            setDeleteAlertTitle("Form cannot be deleted.");
                            setDeleteAlertMessage("Please update the field, '"+relatedFieldName+"' found in "+fviewsEntries[idx][0]+", to remove the reference to allow this form to be deleted.");
                        }
                    })
                })
            }
        })
        return flag;
    }

    const deleteForm = () => {
        // SANITY CHECK. Don't allow the user to delete the form if they've used it in a RelatedRecordSelector field
        if (preventFormDelete()) {
            setOpen(true);
            setPreventDeleteDialog(true);
        }
        else {
            dispatch({ type: 'ui-specification/viewSetDeleted', payload: { viewSetId: viewSetId } });
            handleClose();
        }
    }

    const deleteSection = (viewSetID: string, viewID: string) => {
        dispatch({ type: 'ui-specification/formSectionDeleted', payload: { viewSetID, viewID } });

        // making sure the stepper jumps steps (forward or backward) intuitively 
        if (viewSet.views[viewSet.views.length-1] === viewID && viewSet.views.length > 1) {
            setActiveStep(activeStep-1)
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Button variant="text" color="error" size="medium" startIcon={<DeleteIcon />} onClick={deleteConfirmation}>
                    Delete this form
                </Button>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {deleteAlertTitle}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {deleteAlertMessage}
                        </DialogContentText>
                    </DialogContent>
                    {preventDeleteDialog ?
                        <DialogActions>
                            <Button onClick={handleClose}>OK</Button>
                        </DialogActions>
                        :
                        <DialogActions>
                            <Button onClick={deleteForm}>Yes</Button>
                            <Button onClick={handleClose}>No</Button>
                        </DialogActions>
                    }
                </Dialog>
            </Grid>

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
                                <Typography>Form has been created. No sections or fields added yet.</Typography>
                            </Paper>
                        ) :
                            (
                                <SectionEditor viewSetId={viewSetId} viewId={viewSet.views[activeStep]} deleteCallback={deleteSection} />
                            )
                        }
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Grid container spacing={2} pt={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            label="Section Name"
                            helperText="Enter a name for the form section"
                            name="sectionName"
                            data-testid="sectionName"
                            value={newSectionName}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setNewSectionName(event.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button variant="contained" color="primary" onClick={addNewSection}>
                            Add New Section
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        {alertMessage && <Alert severity="error">{alertMessage}</Alert>}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}