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

import { Alert, Box, Button, Grid, Tab, Tabs, TextField } from "@mui/material";

import AddIcon from '@mui/icons-material/Add';

import { TabContext, TabPanel } from "@mui/lab";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { FormEditor } from "./form-editor";
import { shallowEqual } from "react-redux";
import { Notebook } from "../state/initial";

export const DesignPanel = () => {

    const viewSets = useAppSelector((state: Notebook) => state['ui-specification'].viewsets, shallowEqual);
    const visibleTypes: string[] = useAppSelector((state: Notebook) => state['ui-specification'].visible_types)
    const dispatch = useAppDispatch();

    const [tabIndex, setTabIndex] = useState('0');
    const [newFormName, setNewFormName] = useState('New Form');
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [untickedForms, setUntickedForms] = useState<string[]>(Object.keys(viewSets).filter((form) => !visibleTypes.includes(form)));

    console.log('DesignPanel');
    console.log('tabIndex is', tabIndex);
    console.log('visible forms ', visibleTypes, '& unticked forms ', untickedForms);

    const maxKeys = Object.keys(viewSets).length;

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue.toString());
    }

    const handleCheckboxTabChange = (viewSetID: string, ticked: boolean) => {
        if (!ticked) {
            // add form to the array of unticked forms (the form has already been removed from visible_types at this point)
            setUntickedForms([...untickedForms, viewSetID]);
            // ensure the tab index jumps to the end of all the tabs
            setTabIndex(`${maxKeys - 1}`);
        }
        else {
            // filter the form out of the array of unticked forms (the form has already been re-added to visible_types at this point)
            setUntickedForms(untickedForms.filter((untickedForm) => untickedForm !== viewSetID));
            // ensure the tab index jumps somewhat intuitively
            setTabIndex(`${visibleTypes.length}`);
        }
    }

    const addNewForm = () => {
        setAlertMessage('');
        try {
            dispatch({ type: 'ui-specification/viewSetAdded', payload: { formName: newFormName } });
            setTabIndex(`${visibleTypes.length}`);
            setAlertMessage('');
        }
        catch (error: unknown) {
            error instanceof Error &&
                setAlertMessage(error.message);
        }
    }

    const moveForm = (viewSetID: string, moveDirection: 'left' | 'right') => {
        if (moveDirection === 'left') {
            dispatch({ type: 'ui-specification/viewSetMoved', payload: { viewSetId: viewSetID, direction: 'left' } });
            setTabIndex(`${parseInt(tabIndex) - 1}`);
        }
        else {
            dispatch({ type: 'ui-specification/viewSetMoved', payload: { viewSetId: viewSetID, direction: 'right' } });
            setTabIndex(`${parseInt(tabIndex) + 1}`);
        }
    }


    return (
        <TabContext value={tabIndex}>

            <Alert severity="info" sx={{ marginBottom: 2 }}>
                Define the user interface for your notebook here.  Add one
                or more forms to collect data from users.  Each form can have one or more sections.
                Each section has one or more form fields.
            </Alert>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    aria-label='form tabs'
                    variant='scrollable'
                    scrollButtons={false}
                    indicatorColor={(tabIndex >= `${visibleTypes.length}` && tabIndex < `${maxKeys}`) ? 'secondary' : 'primary'}
                >
                    {visibleTypes.map((form: string, index: number) => {
                        return (
                            <Tab key={index} value={`${index}`} label={`Form: ${viewSets[form].label}`}
                                sx={{
                                    '&.MuiTab-root': {
                                        backgroundColor: '#F9FAFB',
                                        border: '0.75px solid #669911',
                                        borderBottom: 'none',
                                        borderTopLeftRadius: '10px',
                                        borderTopRightRadius: '10px',
                                        marginRight: '0.5em'
                                    },
                                    '&.Mui-selected': {
                                        border: '1px solid #669911',
                                        backgroundColor: '#F5FCE8',
                                    },
                                    '&:hover': {
                                        color: '#669911',
                                        opacity: 1,
                                        backgroundColor: '#F5FCE8',
                                    },
                                }}
                            />
                        )
                    })}
                    {untickedForms.map((form: string, index: number) => {
                        const startIndex: number = index + visibleTypes.length;
                        return (
                            <Tab key={startIndex} value={`${startIndex}`} label={`Form: ${viewSets[form].label}`}
                                sx={{
                                    '&.MuiTab-root': {
                                        backgroundColor: '#F9FAFB',
                                        border: '0.75px solid #E18200',
                                        borderBottom: 'none',
                                        borderTopLeftRadius: '10px',
                                        borderTopRightRadius: '10px',
                                        marginX: '0.25em'
                                    },
                                    '&.Mui-selected': {
                                        color: '#E18200',
                                        border: '1px solid #E18200',
                                        backgroundColor: '#FFF4E5',
                                    },
                                    '&:hover': {
                                        color: '#E18200',
                                        opacity: 1,
                                        backgroundColor: '#FFF4E5',
                                    },
                                }}
                            />
                        )
                    })}
                    <Tab key={maxKeys} value={maxKeys.toString()} icon={<AddIcon />}
                        sx={{
                            '&.MuiTab-root': {
                                backgroundColor: '#F9FAFB',
                                border: '0.75px solid #669911',
                                borderBottom: 'none',
                                borderTopLeftRadius: '10px',
                                borderTopRightRadius: '10px',
                                marginLeft: '0.5em'
                            },
                            '&.Mui-selected': {
                                color: '#669911',
                                border: '1px solid #669911',
                                backgroundColor: '#F5FCE8',
                            },
                            '&:hover': {
                                color: '#669911',
                                opacity: 1,
                                backgroundColor: '#F5FCE8',
                            },
                        }}
                    />
                </Tabs>
            </Box>

            {visibleTypes.map((form: string, index: number) => {
                return (
                    <TabPanel key={index} value={`${index}`} sx={{ paddingX: 0 }}>
                        <FormEditor viewSetId={form} moveCallback={moveForm} moveButtonsDisabled={false} handleChangeCallback={handleCheckboxTabChange} />
                    </TabPanel>
                )
            })}
            {untickedForms.map((form: string, index: number) => {
                const startIndex: number = index + visibleTypes.length;
                return (
                    <TabPanel key={startIndex} value={`${startIndex}`} sx={{ paddingX: 0 }}>
                        <FormEditor viewSetId={form} moveCallback={moveForm} moveButtonsDisabled={true} handleChangeCallback={handleCheckboxTabChange} />
                    </TabPanel>
                )
            })}
            <TabPanel key={maxKeys} value={maxKeys.toString()}>
                <Grid container spacing={2} pt={3}>
                    <Grid item xs={12} sm={6}>
                        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                            e.preventDefault();
                            addNewForm();
                        }}>
                            <TextField
                                fullWidth
                                required
                                label="Form Name"
                                helperText="Enter a name for the form."
                                name="formName"
                                data-testid="formName"
                                value={newFormName}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setNewFormName(event.target.value);
                                }}
                            />
                        </form>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button variant="contained" color="primary" onClick={addNewForm}>
                            Add New Form
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        {alertMessage && <Alert severity="error">{alertMessage}</Alert>}
                    </Grid>
                </Grid>
            </TabPanel>

        </TabContext>
    )
};