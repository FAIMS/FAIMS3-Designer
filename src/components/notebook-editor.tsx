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

import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab, Typography, AppBar, Toolbar } from "@mui/material";

import { useState, useCallback } from "react";
import { InfoPanel } from "./info-panel";
import { DesignPanel } from "./design-panel";
import { ReviewPanel } from './review-panel';
import { useAppDispatch } from '../state/hooks';
import { Notebook } from '../state/initial';
import { NotebookLoader } from "./notebook-loader";

export const NotebookEditor = () => {

    const dispatch = useAppDispatch();

    const loadNotebook = useCallback((notebook: Notebook) => {
        dispatch({ type: 'metadata/loaded', payload: notebook.metadata })
        dispatch({ type: 'ui-specification/loaded', payload: notebook['ui-specification'] })
    }, [dispatch]);

    const [tabNumber, setTabNumber] = useState(0);

    const goToFirstTab = () => {
        setTabNumber(1);
    }

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabNumber(newValue);
    };

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <img
                            src="/static/Fieldmark-Short-Green-NoBorder.png"
                            style={{ maxWidth: '140px', flex: 1 }}
                        />
                        <Box sx={{ flexGrow: 1 }} />
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
                                <Tab label="Export" value="4" />
                            </TabList>
                        </Box>
                        
                        <TabPanel value="0"><NotebookLoader loadFn={loadNotebook} afterLoad={goToFirstTab} /></TabPanel>
                        <TabPanel value="1"><InfoPanel /></TabPanel>
                        <TabPanel value="3"><DesignPanel /></TabPanel>
                        <TabPanel value="4"><ReviewPanel /></TabPanel>

                    </TabContext>
                </Box>
            </Box>
        </>
    );
};