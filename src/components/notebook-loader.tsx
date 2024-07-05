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
import {Grid, Button, Typography} from "@mui/material";
import {initialState, Notebook} from '../state/initial';
import { useAppDispatch } from '../state/hooks';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ValidationError, migrateNotebook } from '../state/migrateNotebook';

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

        return data as Notebook;
    } catch (error) {
        throw new Error('Invalid notebook file: not JSON');
    }
};

export const NotebookLoader = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [errors, setErrors] = useState<string[]>([]);

    const loadFn = useCallback((notebook: Notebook) => {
        try {
          const updatedNotebook = migrateNotebook(notebook);
          dispatch({ type: 'metadata/loaded', payload: updatedNotebook.metadata })
          dispatch({ type: 'ui-specification/loaded', payload: updatedNotebook['ui-specification'] })
          return true;
        } catch (e) {
            if (e instanceof ValidationError) {
                console.log('Error >>', e.messages);
                setErrors(e.messages);
            } else {
                console.log("SOME OTHER ERROR", e);
                setErrors(['unknown error']);
            }
            return false;
        }
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
            setErrors([]);
            file.text()
                .then(text => {
                    const data = validateNotebook(text);
                    if (loadFn(data))  afterLoad();
                })
            .catch(({message}) => {
                setErrors([message]);
            });
        }
    };

    return (
        <Grid container spacing={2} pt={3}>
            <Grid item xs={12} sm={6}>
                <Button component="label" 
                        variant="contained" 
                        startIcon={<CloudUploadIcon />}>
                    Upload file
                    <VisuallyHiddenInput type="file" 
                        onChange={handleFileChange} 
                        // below removes the value on click so we can upload the same file again
                        onClick={(e) => { const element = e.target as HTMLInputElement; element.value = ''; }}/>
                </Button>


                {errors.length ? 
                    (<div>
                         <p>Errors in notebook format:</p> 
                         <ul>{errors.map(e => (<li key={e}>{e}</li>))}</ul>
                    </div>
                    ) : (               
                    <Typography variant="body2" color="text.secondary">
                        Upload a notebook file to start editing.
                    </Typography>)
                }
            </Grid>

            <Grid item xs={12} sm={6}>                           
                <Button variant="contained" onClick={newNotebook}>
                    New Notebook
                </Button>
                <Typography variant="body2" color="text.secondary">
                    Create a new notebook from scratch.
                </Typography>
            </Grid>
        </Grid>
  );
};