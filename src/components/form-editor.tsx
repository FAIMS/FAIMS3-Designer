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

import { Grid, Paper, Alert, Stepper, Typography, Step, Button, StepButton, TextField, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Card, InputAdornment, Tooltip, IconButton, Checkbox, FormControlLabel } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { useAppDispatch, useAppSelector } from "../state/hooks";
import { SectionEditor } from "./section-editor";
import { useState } from "react";
import { shallowEqual } from "react-redux";
import { Notebook } from "../state/initial";

export const FormEditor = ({ viewSetId }: { viewSetId: string }) => {

    const visibleTypes = useAppSelector((state: Notebook) => state['ui-specification'].visible_types);
    const viewsets = useAppSelector((state: Notebook) => state['ui-specification'].viewsets);
    const viewSet = useAppSelector((state: Notebook) => state['ui-specification'].viewsets[viewSetId],
        (left, right) => {
            return shallowEqual(left, right);
        });
    const views = useAppSelector((state: Notebook) => state['ui-specification'].fviews);
    const fields = useAppSelector((state: Notebook) => state['ui-specification'].fields);
    const dispatch = useAppDispatch();

    console.log('FormEditor', viewSetId);
    console.log('FormEditor visible_types', visibleTypes);

    const [activeStep, setActiveStep] = useState(0);
    const [newSectionName, setNewSectionName] = useState('New Section');
    const [alertMessage, setAlertMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [deleteAlertMessage, setDeleteAlertMessage] = useState('');
    const [deleteAlertTitle, setDeleteAlertTitle] = useState('');
    const [preventDeleteDialog, setPreventDeleteDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [checked, setChecked] = useState(true);
    const [initialIndex, setInitialIndex] = useState(visibleTypes.indexOf(viewSetId))

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (ticked: boolean) => {
        setChecked(ticked);
        dispatch({ type: 'ui-specification/formVisibilityUpdated', payload: { viewSetId, ticked, initialIndex } });
    }

    const addNewSection = () => {
        try {
            dispatch({ type: 'ui-specification/formSectionAdded', payload: { viewSetId: viewSetId, sectionLabel: newSectionName } });
        } catch (error: unknown) {
            error instanceof Error &&
                setAlertMessage(error.message);
        }
    }

    const deleteSection = (viewSetID: string, viewID: string) => {
        dispatch({ type: 'ui-specification/formSectionDeleted', payload: { viewSetID, viewID } });

        // making sure the stepper jumps steps (forward or backward) intuitively 
        if (viewSet.views[viewSet.views.length - 1] === viewID && viewSet.views.length > 1) {
            setActiveStep(activeStep - 1)
        }
    }

    const updateFormLabel = (label: string) => {
        dispatch({ type: 'ui-specification/formNameUpdated', payload: { viewSetId, label } });
    }

    const deleteConfirmation = () => {
        setOpen(true);
        setPreventDeleteDialog(false);
        setDeleteAlertTitle("Are you sure you want to delete this form?");
        setDeleteAlertMessage("All fields in the form will also be deleted.");
    }

    const findRelatedFieldLocation = (fieldName: string | undefined) => {
        // making fviews iterable
        const fviewsEntries = Object.entries(views)
        fviewsEntries.forEach((_viewId, idx) => {
            // iterating over every section's fields array to find fieldName
            fviewsEntries[idx][1].fields.forEach((field) => {
                if (field === fieldName) {
                    // extracting which section fieldName belongs to
                    const sectionToFind = fviewsEntries[idx][0];
                    // making viewsets iterable
                    const viewsetsEntries = Object.entries(viewsets);
                    viewsetsEntries.forEach((_viewSetId, idx) => {
                        // iterating over every form's views array to find the section
                        viewsetsEntries[idx][1].views.forEach((view) => {
                            if (view === sectionToFind) {
                                // we made it! now extract the form and section labels
                                const formLabel: string = viewsetsEntries[idx][1].label;
                                const sectionLabel: string = fviewsEntries[idx][1].label;

                                // setting the dialog text here
                                setDeleteAlertTitle("Form cannot be deleted.");
                                setDeleteAlertMessage("Please update the field '" + fieldName + "', found in form " + formLabel + " section " + sectionLabel + ", to remove the reference to allow this form to be deleted.");
                            }
                        })
                    })
                }
            })
        })
    }

    const preventFormDelete = () => {
        // we don't need the field keys, only their values
        const fieldValues = Object.values(fields)
        let flag: boolean = false;
        // search through all the values for mention of the form to be deleted in the related_type param
        fieldValues.forEach((fieldValue) => {
            if (fieldValue["component-parameters"].related_type === viewSetId) {
                flag = true;
                // extracting the name of the field to advise the user
                const relatedFieldName = fieldValue["component-parameters"].name;
                // finding the exact location of the field in the notebook to advise the user
                findRelatedFieldLocation(relatedFieldName);
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

    return (
        <Grid container spacing={2}>
            <Grid container item xs={12}>
                <Grid item xs={3}>
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

                <Grid item xs={3}>
                    <Tooltip arrow title="Tick to include 'Add New Record' button.">
                        <FormControlLabel
                            control={<Checkbox
                                checked={checked}
                                size="small"
                                onChange={(e) => handleChange(e.target.checked)}
                            />}
                            label="Visible on Top"
                        />
                    </Tooltip>
                </Grid>

                <Grid item xs={3}>
                    <Button variant="text" size="medium" startIcon={<EditIcon />} onClick={() => setEditMode(true)}>
                        Edit form name
                    </Button>
                    {editMode &&
                        <TextField
                            size="small"
                            margin="dense"
                            label="Form Name"
                            name="label"
                            data-testid="label"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title="Done / Close">
                                            <IconButton onClick={() => setEditMode(false)}>
                                                <CloseRoundedIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                            }}
                            value={viewSet.label}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                updateFormLabel(event.target.value);
                            }}
                            sx={{ '& .MuiInputBase-root': { paddingRight: 0 } }}
                        />
                    }
                </Grid>

                <Grid item xs={3}>

                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Card variant="outlined">
                    <Grid container spacing={2} p={3}>
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
                    <Grid container spacing={2} p={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Section Name"
                                helperText="Enter a name for the form section."
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
                </Card>
            </Grid>
        </Grid>
    );
}