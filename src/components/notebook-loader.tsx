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

// Component to load a notebook file and initialise the state
import {styled} from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {Grid, Button, Typography, Dialog, DialogActions, DialogTitle, DialogContentText, IconButton} from "@mui/material";
import {initialState, Notebook} from '../state/initial';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { slugify } from '../state/uiSpec-reducer';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const validateNotebook = (jsonText: string): Notebook => {
    try {
        const data = JSON.parse(jsonText);

        if (typeof data !== 'object') {
            throw new Error('Invalid notebook file: not an object');
        }

        if (!Object.prototype.hasOwnProperty.call(data, 'metadata')) {
            throw new Error('Invalid notebook file: metadata missing');
        }

        if (!Object.prototype.hasOwnProperty.call(data, 'ui-specification')) {
            throw new Error('Invalid notebook file: ui-specification missing');
        }

        return data as Notebook;
    } catch (error) {
        throw new Error('Invalid notebook file: not JSON');
    }
};

export const NotebookLoader = () => {

    const dispatch = useAppDispatch();
    const notebookModified = useAppSelector((state: Notebook) => state['ui-specification'].modified);
    const state = useAppSelector((state: Notebook) => state);
    const updateSavedState = (savedState: boolean) => {
        dispatch({type: 'ui-specification/notebookSaved', payload: {savedState}});
    }

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [alertTitle, setAlertTitle ] = useState(' ');
    const [alertMsgContext, setAlertMsgContext ] = useState(' ');
    const [alertBtnLabel, setAlertBtnLabel ] = useState(' ');
    const [isUpload, setIsUpload ] = useState(false);

    const handleContinue = () => {
        setOpen(false);
        newNotebook();
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleNewNotebook = () => {
        if(notebookModified) {
            setIsUpload(false)
            setAlertTitle("Start a new notebook?")
            setAlertMsgContext("You have a notebook currently open. Starting a new notebook will overwrite your work.");
            setAlertBtnLabel("Start New Notebook");
            setOpen(true);
        }
        else {
            newNotebook();
        }
    }

    const handleUploadFile = () => {
        if(notebookModified) {
            setIsUpload(true);
            setAlertTitle("Upload a notebook file?")
            setAlertMsgContext("You have a notebook currently open. Uploading a new file will overwrite your work.");
            setAlertBtnLabel("Continue Uploading");
            setOpen(true);
        }
    }

    const loadFn = useCallback((notebook: Notebook) => {
        dispatch({ type: 'metadata/loaded', payload: notebook.metadata })
        dispatch({ type: 'ui-specification/loaded', payload: notebook['ui-specification'] })
    }, [dispatch]);

    const afterLoad = () =>  {
        navigate("/info");
    }

    const newNotebook = () => {
            loadFn(initialState);
            afterLoad();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.item(0);
        if (file) {
            file.text()
                .then(text => {
                    const data = validateNotebook(text);
                    loadFn(data);
                    afterLoad();
                })
            .catch((error) => {
            console.error(error); 
            });
        }
    };

    const downloadNotebook = () => {
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
        element.href = URL.createObjectURL(file);
        const name = slugify(state.metadata.name as string);
        element.download = `${name}.json`;
        document.body.appendChild(element);
        element.click();
        setOpen(false);
        updateSavedState(true);
    };

    return (
        <Grid container spacing={2} pt={3}>
            <Grid item xs={12} sm={6}>
                <Button
                        component="label" 
                        variant="contained" 
                        startIcon={<CloudUploadIcon />}
                        onClick={handleUploadFile}
                >
                    Upload file
                    {!notebookModified ? (
                    <VisuallyHiddenInput type="file" onChange={handleFileChange} id="file-upload"/>
                    ) : (null)}
                </Button>

                <Typography variant="body2" color="text.secondary">
                   Upload a notebook file to start editing.
                </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>                           
                <Button variant="contained" onClick={handleNewNotebook}>
                    New Notebook
                </Button>
                <Typography variant="body2" color="text.secondary">
                    Create a new notebook from scratch.
                </Typography>
            </Grid>
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                    <DialogTitle id="draggable-dialog-title">
                    <Typography sx={{ ml: 0, flex: 1 }} variant="h6" component="div">
                        {alertTitle}
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContentText id="alert-dialog-title" sx={{ p: 3}}>
                    {alertMsgContext}
                </DialogContentText>
                <DialogActions sx={{ pb: 3, pr: 1, justifyContent: "center"}}>
                    <Button onClick={downloadNotebook} variant="outlined" sx={{ mr: 1}}>Save Current Notebook</Button>
                    {isUpload ? (
                        <Button autoFocus
                            component="label" 
                            variant="outlined" 
                            startIcon={<CloudUploadIcon />}>
                            {alertBtnLabel}
                            <VisuallyHiddenInput type="file" onChange={handleFileChange} id="file-upload"/>
                        </Button>
                        ) : (
                        <Button autoFocus onClick={handleContinue} variant="outlined" >
                            {alertBtnLabel}
                        </Button>)}     
                </DialogActions>
            </Dialog>
        </Grid>
  );
};