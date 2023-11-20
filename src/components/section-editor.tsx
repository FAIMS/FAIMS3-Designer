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

import { Grid, TextField, Button, Dialog, DialogActions, DialogTitle, InputAdornment, Tooltip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';

import { FieldList } from "./field-list";
import { useAppSelector, useAppDispatch } from "../state/hooks";
import { Notebook } from '../state/initial';
import { useState } from "react";

type Props = {
    viewSetId: string,
    viewId: string,
    deleteCallback: (viewSetID: string, viewID: string) => void,
};

export const SectionEditor = ({ viewSetId, viewId, deleteCallback }: Props) => {

    const fView = useAppSelector((state: Notebook) => state['ui-specification'].fviews[viewId]);
    const dispatch = useAppDispatch();

    console.log('SectionEditor', viewId);

    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const updateSectionLabel = (label: string) => {
        dispatch({ type: 'ui-specification/sectionNameUpdated', payload: { viewId, label } });
    }

    const handleClose = () => {
        setOpen(false);
    }

    const deleteSection = () => {
        deleteCallback(viewSetId, viewId)
        handleClose();
    }

    return (
        <>
            <Grid container spacing={2} pb={2}>
                <Grid item sm={4}>
                    <Button variant="text" color="error" size="small" startIcon={<DeleteIcon />} onClick={() => setOpen(true)}>
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

                <Grid item sm={4}>
                    <Button variant="text" size="small" startIcon={<EditIcon />} onClick={() => setEditMode(true)}>
                        Edit section name
                    </Button>
                    {editMode &&
                        <TextField
                            required
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


                <Grid item sm={4}>
                /* move left and right buttons will be here */
                </Grid>
            </Grid>


            <FieldList viewId={viewId} viewSetId={viewSetId} />
        </>
    );
}