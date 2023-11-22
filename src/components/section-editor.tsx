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

import { Grid, TextField, Button, Dialog, DialogActions, DialogTitle, InputAdornment, Tooltip, IconButton, Alert } from "@mui/material";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

import { FieldList } from "./field-list";
import { useAppSelector, useAppDispatch } from "../state/hooks";
import { Notebook } from '../state/initial';
import { useState } from "react";

type Props = {
    viewSetId: string,
    viewId: string,
    viewSet: {
        views: string[];
        label: string;
    }
    deleteCallback: (viewSetID: string, viewID: string) => void,
    addCallback: (viewSetID: string, label: string) => boolean,
    moveCallback: (viewSetID: string, viewID: string, moveDirection: 'left' | 'right') => void
};

export const SectionEditor = ({ viewSetId, viewId, viewSet, deleteCallback, addCallback, moveCallback }: Props) => {

    const fView = useAppSelector((state: Notebook) => state['ui-specification'].fviews[viewId]);
    const dispatch = useAppDispatch();

    console.log('SectionEditor', viewId);
    console.log('SectionEditor', viewSet);

    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [addMode, setAddMode] = useState(false);
    const [newSectionName, setNewSectionName] = useState('New Section');
    const [addAlertMessage, setAddAlertMessage] = useState('');

    const handleClose = () => {
        setOpen(false);
    }

    const deleteSection = () => {
        deleteCallback(viewSetId, viewId);
        handleClose();
    }

    const updateSectionLabel = (label: string) => {
        dispatch({ type: 'ui-specification/sectionRenamed', payload: { viewId, label } });
    }

    const addNewSection = () => {
        // run the function to add a new section AND save the returned success status to a variable
        const addSuccess: boolean = addCallback(viewSetId, newSectionName);

        // depending on addSuccess, set relevant state variables
        if (addSuccess) {
            setAddMode(false);
            setAddAlertMessage('');
        }
        else {
            // manually setting the error message
            setAddAlertMessage('Section '+newSectionName+' already exists in this form.')
        }
    }

    const moveSection = (moveDirection: 'left' | 'right') => {
        moveCallback(viewSetId, viewId, moveDirection);
    }

    return (
        <>
            <Grid container spacing={2} pb={2}>
                <Grid item xs={3}>
                    <Button variant="text" color="error" size="small" startIcon={<DeleteRoundedIcon />} onClick={() => setOpen(true)}>
                        Delete this section
                    </Button>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            Are you sure you want to delete this section?
                        </DialogTitle>
                        <DialogActions>
                            <Button onClick={deleteSection}>Yes</Button>
                            <Button onClick={handleClose}>No</Button>
                        </DialogActions>
                    </Dialog>
                </Grid>

                <Grid item xs={3}>
                    <Button variant="text" size="small" startIcon={<EditRoundedIcon />} onClick={() => setEditMode(true)}>
                        Edit section name
                    </Button>
                    {editMode &&
                        <TextField
                            size="small"
                            margin="dense"
                            label="Section Name"
                            name="label"
                            data-testid="label"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title="Done">
                                            <IconButton onClick={() => setEditMode(false)}>
                                                <DoneRoundedIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Close">
                                            <IconButton onClick={() => setEditMode(false)}>
                                                <CloseRoundedIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                            }}
                            value={fView.label}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                updateSectionLabel(event.target.value);
                            }}
                            sx={{ '& .MuiInputBase-root': { paddingRight: 0 } }}
                        />
                    }
                </Grid>

                <Grid item xs={2}>
                    <Tooltip title='Move left'>
                        <IconButton disabled={viewSet.views.indexOf(viewId) === 0 ? true : false} onClick={() => moveSection('left')} aria-label='left' size='small'>
                            <ArrowBackRoundedIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Move right'>
                        <IconButton disabled={viewSet.views.indexOf(viewId) === (viewSet.views.length-1) ? true : false} onClick={() => moveSection('right')} aria-label='right' size='small'>
                            <ArrowForwardRoundedIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>

                <Grid item xs={4}>
                    <Button variant="text" size="small" startIcon={<AddCircleOutlineRoundedIcon />} onClick={() => setAddMode(true)}>
                        Add new section
                    </Button>
                    {addMode &&
                        <TextField
                            required
                            fullWidth
                            size="small"
                            margin="dense"
                            label="New Section Name"
                            name="sectionName"
                            data-testid="sectionName"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title="Add">
                                            <IconButton onClick={addNewSection}>
                                                <AddRoundedIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Close">
                                            <IconButton onClick={() => {
                                                setAddMode(false);
                                                setAddAlertMessage('');
                                            }}>
                                                <CloseRoundedIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                            }}
                            value={newSectionName}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setNewSectionName(event.target.value);
                            }}
                            sx={{ '& .MuiInputBase-root': { paddingRight: 0 } }}
                        />
                    }
                    {addAlertMessage && <Alert severity="error">{addAlertMessage}</Alert>}
                </Grid>
            </Grid>


            <FieldList viewId={viewId} viewSetId={viewSetId} />
        </>
    );
}