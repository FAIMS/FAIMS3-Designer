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

import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Grid, Tab, Typography, AppBar, Toolbar, IconButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

import { useEffect, useState } from "react";
import { InfoPanel } from "./info-panel";
import { RolesPanel } from "./roles-panel";
import { DesignPanel } from "./design-panel";
import { ReviewPanel } from './review-panel';
import { useAppDispatch } from '../state/hooks';
import { Notebook } from '../state/initial';

export const NotebookEditor = ({ notebook }: { notebook: Notebook }) => {

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch({ type: 'metadata/loaded', payload: notebook.metadata })
        dispatch({ type: 'ui-specification/loaded', payload: notebook['ui-specification'] })
    }, [notebook, dispatch]);

    const [tabNumber, setTabNumber] = useState(0);

    const maxTabs = 5;

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabNumber(newValue);
    };

    const nextTab = () => {
        tabNumber < maxTabs ? setTabNumber(tabNumber + 1) : setTabNumber(maxTabs);
    };

    const previousTab = () => {
        tabNumber > 1 ? setTabNumber((tabNumber - 1)) : setTabNumber(1);
    };

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <img
                            src="/static/Fieldmark-Short-Green-NoBorder.png"
                            style={{ maxWidth: '140px', flex: 1 }}
                        />
                        <Box sx={{ flexGrow: 1 }} />
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
            </Box>

            <Box p={3}>
                <Typography variant="h1">Notebook Editor</Typography>

                <Box pt={2}>
                    <TabContext value={tabNumber.toString()}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Start" value="0" />
                                <Tab label="Info" value="1" />
                                <Tab label="Design" value="3" />
                                <Tab label="Review" value="4" />
                                <Tab label="Submit" value="5" />
                            </TabList>
                        </Box>
                        
                        <TabPanel value="0">Placeholder for notebook loading.</TabPanel>
                        <TabPanel value="1"><InfoPanel /></TabPanel>
                        <TabPanel value="3"><DesignPanel /></TabPanel>
                        <TabPanel value="4"><ReviewPanel /></TabPanel>
                        <TabPanel value="5">Submit</TabPanel>

                        <Grid
                            container
                            spacing={2}
                            justifyContent="space-between"
                        >
                            <Grid item>
                                {tabNumber > 1 ?
                                    <Button variant="contained" color="primary" onClick={previousTab} >&lt; Previous</Button>
                                    : <div>&nbsp;</div>
                                }
                            </Grid>
                            <Grid item>
                                {tabNumber < maxTabs ?
                                    <Button variant="contained" color="primary" onClick={nextTab} >Next &gt;</Button>
                                    : <div>&nbsp;</div>
                                }
                            </Grid>
                        </Grid>

                    </TabContext>
                </Box>
            </Box>
        </>
    );
};