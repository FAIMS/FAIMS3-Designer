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

import { Grid, TextField, Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

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
            <Grid container spacing={2}>
                <Grid item sm={6} p={2}>
                    <TextField
                        fullWidth
                        required
                        label="Section Name"
                        helperText="Name for this section of the form."
                        name="label"
                        data-testid="label"
                        value={fView.label}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            updateSectionLabel(event.target.value);
                        }}
                    />
                </Grid>
                <Grid item sm={6}>
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
            </Grid>


            <FieldList viewId={viewId} viewSetId={viewSetId} />
        </>
    );
}