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

import { Alert, Button, Checkbox, FormControlLabel, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../state/hooks";

import '@mdxeditor/editor/style.css'

// importing the editor and the plugin from their full paths
import { MDXEditor } from '@mdxeditor/editor/MDXEditor';
import { MDXEditorMethods } from '@mdxeditor/editor';
import { headingsPlugin } from '@mdxeditor/editor/plugins/headings';
import { listsPlugin } from '@mdxeditor/editor/plugins/lists';
import { quotePlugin } from '@mdxeditor/editor/plugins/quote';
import { thematicBreakPlugin } from '@mdxeditor/editor/plugins/thematic-break';
import { markdownShortcutPlugin } from '@mdxeditor/editor/plugins/markdown-shortcut';
import { tablePlugin } from '@mdxeditor/editor/plugins/table';

// importing the toolbar and desired toggle components
import { UndoRedo } from '@mdxeditor/editor/plugins/toolbar/components/UndoRedo';
import { BoldItalicUnderlineToggles } from '@mdxeditor/editor/plugins/toolbar/components/BoldItalicUnderlineToggles';
import { BlockTypeSelect } from '@mdxeditor/editor/plugins/toolbar/components/BlockTypeSelect';
import { ListsToggle } from '@mdxeditor/editor/plugins/toolbar/components/ListsToggle';
import { InsertTable } from '@mdxeditor/editor/plugins/toolbar/components/InsertTable';
import { Separator } from '@mdxeditor/editor';
import { toolbarPlugin } from '@mdxeditor/editor/plugins/toolbar';
import { Notebook, PropertyMap } from "../state/initial";

export const InfoPanel = () => {

    const metadata = useAppSelector((state: Notebook) => state.metadata);
    const dispatch = useAppDispatch();

    const ref = useRef<MDXEditorMethods>(null)

    const [metadataFieldName, setMetadataFieldName] = useState('');
    const [metadataFieldValue, setMetadataFieldValue] = useState('');
    const [extraFields, setExtraFields] = useState<PropertyMap>({});
    const [alert, setAlert] = useState('');

    useEffect(() => {
        const knownFields = ['name', 'pre_description', 'behaviours', 'meta',
            'project_lead', 'lead_institution', 'showQRCodeButton',
            'access', 'accesses', 'forms', 'filenames',
            'ispublic', 'isrequest', 'sections',
            'project_status', 'schema_version'];
        const unknownFields = Object.keys(metadata).filter((key) => !knownFields.includes(key));
        const newExtraFields: PropertyMap = {};
        unknownFields.forEach((key) => {
            newExtraFields[key] = metadata[key];
        });
        setExtraFields(newExtraFields);
    }, [metadata]);

    const setProp = (property: string, value: string | undefined) => {
        dispatch({ type: 'metadata/propertyUpdated', payload: { property, value } });
    };

    const updateMetadataFieldName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMetadataFieldName(event.target.value);
    };

    const updateMetadataFieldValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMetadataFieldValue(event.target.value);
    };

    const addNewMetadataField = () => {
        setAlert('');
        if (metadataFieldName in metadata) {
            setAlert(`Field '${metadataFieldName}' already exists`);
        } else {
            setMetadataFieldName('');
            setMetadataFieldValue('');
            setProp(metadataFieldName, metadataFieldValue);
        }
    };

    return (
        <div>
            <Typography variant="h2">General Information</Typography>

            <Grid container spacing={2} pt={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        required
                        label="Project Name"
                        helperText="Enter a string between 2 and 100 characters long"
                        name="name"
                        data-testid="name"
                        value={metadata.name}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setProp('name', event.target.value);
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Project Lead"
                        name="project_lead"
                        value={metadata.project_lead}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setProp('project_lead', event.target.value);
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Alert severity="info">Use the editor below for the project description.</Alert>
                    <MDXEditor
                        markdown={metadata.pre_description as string}
                        plugins={[
                            headingsPlugin(),
                            listsPlugin(),
                            quotePlugin(),
                            thematicBreakPlugin(),
                            markdownShortcutPlugin(),
                            tablePlugin(),
                            toolbarPlugin({
                                toolbarContents: () => (
                                    <>
                                        <UndoRedo />
                                        <Separator />
                                        <BoldItalicUnderlineToggles />
                                        <Separator />
                                        <BlockTypeSelect />
                                        <Separator />
                                        <ListsToggle />
                                        <Separator />
                                        <InsertTable />
                                    </>
                                )
                            }),

                        ]}
                        ref={ref}
                        onChange={() => setProp('pre_description', ref.current?.getMarkdown())}
                        contentEditableClassName="mdxEditor"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Lead Institution"
                        name="lead_institution"
                        value={metadata.lead_institution}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setProp('lead_institution', event.target.value);
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControlLabel
                            control={<Checkbox
                            checked={metadata.showQRCodeButton || false}
                            onChange={(e) => setProp('showQRCodeButton', e.target.checked)}
                    />} label="Enable QR Code Search of records" />
                    <br/>
                    <Typography variant='caption'>Useful if your form includes a QR code field.</Typography>
                </Grid>

                <Grid container item xs={12} spacing={2}>

                    {Object.keys(extraFields).map((key) => {
                        return (
                            <Grid item xs={12} key={key}>
                                <TextField
                                    fullWidth
                                    label={key}
                                    name={key}
                                    value={extraFields[key]}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setProp(key, event.target.value);
                                    }}
                                />
                            </Grid>
                        );
                    })}

                    {alert &&
                        <Grid item xs={12}>
                            <Alert onClose={() => { setAlert('') }} severity="error">{alert}</Alert>
                        </Grid>}

                    <Grid item xs={5}>
                        <TextField
                            fullWidth
                            label="Metadata Field Name"
                            name="metadata_field_name"
                            value={metadataFieldName}
                            onChange={updateMetadataFieldName}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            fullWidth
                            label="Metadata Field Value"
                            name="metadata_field_value"
                            value={metadataFieldValue}
                            onChange={updateMetadataFieldValue}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={addNewMetadataField}>+</Button>
                    </Grid>
                </Grid>

            </Grid>

        </div>
    );
}