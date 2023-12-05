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

import { Alert, Button, Checkbox, FormControlLabel, FormHelperText, Grid, TextField, Typography, Card } from "@mui/material";
import { useEffect, useState, useRef, Suspense } from "react";
import { useAppSelector, useAppDispatch } from "../state/hooks";
import { Notebook, PropertyMap } from "../state/initial";

import '@mdxeditor/editor/style.css';

// importing the editor and the plugins from their full paths
import { MDXEditor } from '@mdxeditor/editor/MDXEditor';
import { MDXEditorMethods, MdastImportVisitor, Separator, realmPlugin, system } from '@mdxeditor/editor';
import { toolbarPlugin } from '@mdxeditor/editor/plugins/toolbar';
import { headingsPlugin } from '@mdxeditor/editor/plugins/headings';
import { listsPlugin } from '@mdxeditor/editor/plugins/lists';
import { quotePlugin } from '@mdxeditor/editor/plugins/quote';
import { thematicBreakPlugin } from '@mdxeditor/editor/plugins/thematic-break';
import { markdownShortcutPlugin } from '@mdxeditor/editor/plugins/markdown-shortcut';
import { tablePlugin } from '@mdxeditor/editor/plugins/table';
import { diffSourcePlugin } from '@mdxeditor/editor/plugins/diff-source';
import { linkPlugin } from '@mdxeditor/editor/plugins/link';

// importing the desired toolbar toggle components
import { UndoRedo } from '@mdxeditor/editor/plugins/toolbar/components/UndoRedo';
import { BoldItalicUnderlineToggles } from '@mdxeditor/editor/plugins/toolbar/components/BoldItalicUnderlineToggles';
import { BlockTypeSelect } from '@mdxeditor/editor/plugins/toolbar/components/BlockTypeSelect';
import { ListsToggle } from '@mdxeditor/editor/plugins/toolbar/components/ListsToggle';
import { InsertTable } from '@mdxeditor/editor/plugins/toolbar/components/InsertTable';
import { DiffSourceToggleWrapper } from '@mdxeditor/editor/plugins/toolbar/components/DiffSourceToggleWrapper';


export const InfoPanel = () => {

    const metadata = useAppSelector((state: Notebook) => state.metadata);
    const dispatch = useAppDispatch();

    const ref = useRef<MDXEditorMethods>(null);

    const [metadataFieldName, setMetadataFieldName] = useState('');
    const [metadataFieldValue, setMetadataFieldValue] = useState('');
    const [extraFields, setExtraFields] = useState<PropertyMap>({});
    const [alert, setAlert] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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

    const setProp = (property: string, value: string) => {
        setErrorMessage('');
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
            setAlert(`Field '${metadataFieldName}' already exists.`);
        } else {
            setMetadataFieldName('');
            setMetadataFieldValue('');
            setProp(metadataFieldName, metadataFieldValue);
        }
    };

    /*
        The following is taken from and inspired by: 
        https://github.com/mdx-editor/editor/issues/202#issuecomment-1827182167 & 
        https://github.com/mdx-editor/editor/issues/95#issuecomment-1755320066 
    */
    const catchAllVisitor: MdastImportVisitor<any> = {
        testNode: () => true,
        visitNode: ({ mdastNode, actions }) => {
            // deviating from the example shown in the second link,
            // for now, I'm simply showing an error message
            setErrorMessage(`Sorry, we currently do not support the markdown ${mdastNode?.type} option. 
            What you have just written was automatically removed. Please continue carefully.`);
        }
    };

    const [catchAllPlugin] = realmPlugin({
        id: "catchAll",
        systemSpec: system(() => ({})),
        init: (realm) => {
            realm.pubKey("addImportVisitor", catchAllVisitor);
        }
    });

    return (
        <div>
            <Typography variant="h2">General Information</Typography>
            <Card variant="outlined" sx={{ mt: 2 }}>
                <Grid container spacing={4} p={3}>
                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                required
                                label="Project Name"
                                name="name"
                                data-testid="name"
                                value={metadata.name}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setProp('name', event.target.value);
                                }}
                            />
                            <FormHelperText>Enter a string between 2 and 100 characters long.</FormHelperText>
                        </Grid>

                        <Grid item xs={12} sm={4}>
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

                        <Grid item xs={12} sm={4}>
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
                    </Grid>

                    <Grid item xs={12}>
                        <Suspense fallback={<div>Loading...</div>}>
                            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                            <Card variant="outlined">
                                <MDXEditor
                                    placeholder="Start typing a project description..."
                                    markdown={metadata.pre_description as string}
                                    plugins={[
                                        headingsPlugin(),
                                        listsPlugin(),
                                        quotePlugin(),
                                        thematicBreakPlugin(),
                                        markdownShortcutPlugin(),
                                        tablePlugin(),
                                        diffSourcePlugin({ diffMarkdown: metadata.pre_description as string }),
                                        linkPlugin(),
                                        toolbarPlugin({
                                            toolbarContents: () => (
                                                <DiffSourceToggleWrapper>
                                                    <UndoRedo />
                                                    <Separator />
                                                    <BoldItalicUnderlineToggles />
                                                    <Separator />
                                                    <BlockTypeSelect />
                                                    <Separator />
                                                    <ListsToggle />
                                                    <Separator />
                                                    <InsertTable />
                                                </DiffSourceToggleWrapper>
                                            )
                                        }),
                                        catchAllPlugin(),
                                    ]}
                                    ref={ref}
                                    contentEditableClassName="mdxEditor"
                                    onChange={() => setProp('pre_description', ref.current?.getMarkdown() as string)}
                                />
                            </Card>
                        </Suspense>
                        <FormHelperText>
                            Use the editor above for the project description.
                            If you use source mode, make sure you put blank lines before and after any markdown syntax for compatibility.
                        </FormHelperText>
                    </Grid>

                    <Grid container item xs={12} spacing={2} justifyContent="space-between">
                        <Grid item xs={12} sm={4}>
                            <FormControlLabel
                                control={<Checkbox
                                    checked={metadata.showQRCodeButton === "true"}
                                    onChange={(e) => setProp('showQRCodeButton', e.target.checked ? "true" : "false")}
                                />} label="Enable QR Code Search of records" />
                            <FormHelperText>Useful if your form includes a QR code field.</FormHelperText>
                        </Grid>

                        <Grid item xs={12} sm={8}>
                            <Card variant="outlined">
                                <Grid container p={2.5} spacing={3}>
                                    <Grid
                                        container item xs={12} sm={5}
                                        direction="column"
                                        justifyContent="flex-start"
                                        alignItems="flex-start"
                                    >
                                        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                                            e.preventDefault();
                                            addNewMetadataField();
                                        }}>
                                            <TextField
                                                fullWidth
                                                label="Metadata Field Name"
                                                name="metadata_field_name"
                                                size="small"
                                                value={metadataFieldName}
                                                onChange={updateMetadataFieldName}
                                            />
                                            <TextField
                                                fullWidth
                                                sx={{ mt: 1.5 }}
                                                label="Metadata Field Value"
                                                name="metadata_field_value"
                                                size="small"
                                                value={metadataFieldValue}
                                                onChange={updateMetadataFieldValue}
                                            />
                                            <Button
                                                sx={{ my: 2.5 }}
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                            >
                                                Create New Field
                                            </Button>
                                            {alert &&
                                                <Alert onClose={() => { setAlert('') }} severity="error">{alert}</Alert>
                                            }
                                        </form>
                                    </Grid>

                                    <Grid container item xs={12} sm={7} rowGap={1}>
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
                                    </Grid>
                                </Grid>
                            </Card>
                            <FormHelperText>Use the form above to create new metadata fields, if needed.</FormHelperText>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>
        </div>
    );
}