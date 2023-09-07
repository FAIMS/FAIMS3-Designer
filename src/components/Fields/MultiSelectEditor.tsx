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

import { Grid, TextField, List, ListItem, ListItemText, Alert, Button, Card, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import { BaseFieldEditor } from "./BaseFieldEditor"
import { useAppSelector, useAppDispatch } from "../../state/hooks";
import { useState } from "react";

export const MultiSelectEditor = ({ fieldName }: any) => {

    const field = useAppSelector(state => state['ui-specification'].fields[fieldName]);
    const dispatch = useAppDispatch();

    const [newOption, setNewOption] = useState('');

    const getOptions = () => {
        let options = [];
        if (field['component-parameters'].ElementProps) {
            options = field['component-parameters'].ElementProps.options
            options = options.map((pair: any) => pair.label.trim())
        } else {
            field['component-parameters'].ElementProps = { options: [] }
        }
        return options;
    }

    const options = getOptions();

    const updateOptions = (updatedOptions: string[]) => {
        // take a deep copy of the field
        const newField = JSON.parse(JSON.stringify(field))
        newField['component-parameters'].ElementProps.options = updatedOptions.map(o => { return { label: o, value: o } })
        dispatch({ type: 'ui-specification/fieldUpdated', payload: { fieldName, newField } })
    }

    const addOption = () => {
        const newOptions = [...options, newOption]
        updateOptions(newOptions)
        setNewOption('')
    }

    const removeOption = (option: string) => {
        const newOptions = options.filter((o: string) => o !== option)
        updateOptions(newOptions)
    }

    return (
        <BaseFieldEditor fieldName={fieldName}>
            <Grid item xs={12}>
                <Card variant="outlined" sx={{ display: 'flex' }}>
                    <Grid item xs={6} sx={{ m: 1.5 }}>
                        <Alert severity="info">Add and remove options as needed.</Alert>
                        <Grid item alignItems="stretch" style={{ display: "flex" }}>
                            <TextField
                                label="Add Option"
                                value={newOption}
                                onChange={(e) => setNewOption(e.target.value)}
                                sx={{ mt: 1.5 }} />
                            <Button
                                color="primary"
                                startIcon={<AddCircleIcon />}
                                variant="outlined"
                                onClick={addOption}
                                sx={{ mt: 1.5 }}
                            >
                                ADD{' '}
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} sx={{ m: 1.5 }}>
                        <List>
                            {options.map((option: string) => {
                                return (
                                    <ListItem
                                        key={option}
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => removeOption(option)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        }>
                                        <ListItemText primary={option} />
                                    </ListItem>
                                )
                            })}
                        </List>
                    </Grid>
                </Card>
            </Grid>
        </BaseFieldEditor>
    )
}