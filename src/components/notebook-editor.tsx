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

import { TabContext, TabList } from "@mui/lab";
import { Box, Tab, Typography, AppBar, Toolbar } from "@mui/material";

import { useCallback } from "react";
import { InfoPanel } from "./info-panel";
import { DesignPanel } from "./design-panel";
import { ReviewPanel } from './review-panel';
import { useAppDispatch } from '../state/hooks';
import { Notebook } from '../state/initial';
import { NotebookLoader } from "./notebook-loader";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";

export const NotebookEditor = () => {
   
    const dispatch = useAppDispatch();

    const loadNotebook = useCallback((notebook: Notebook) => {
        dispatch({ type: 'metadata/loaded', payload: notebook.metadata })
        dispatch({ type: 'ui-specification/loaded', payload: notebook['ui-specification'] })
    }, [dispatch]);

    const navigate = useNavigate();
    const { pathname } = useLocation();

    const goToFirstTab = () => {
        navigate("/info");
    }

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
                    <TabContext value={pathname}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList aria-label="lab API tabs example">
                                <Tab label="Start" component={Link} to="/" value="/" />
                                <Tab label="Info" component={Link} to="/info" value="/info" />
                                <Tab label="Design" component={Link} to="/design" value="/design" />
                                <Tab label="Export" component={Link} to="/export" value="/export" />
                            </TabList>
                        </Box>
                    </TabContext>
                </Box>

                <Routes>
                    <Route path="/" element={<NotebookLoader loadFn={loadNotebook} afterLoad={goToFirstTab} />} />
                    <Route path="/info" element={<InfoPanel />} />
                    <Route path="/design" element={<DesignPanel />} />
                    <Route path="/export" element={<ReviewPanel />} />
                </Routes>
            </Box>
        </>
    );
};