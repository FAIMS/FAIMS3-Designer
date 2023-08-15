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


export type NotebookMetadata = PropertyMap;

type PropertyMap = {
    [key: string]: unknown 
}

type NotebookMetadataFixedProperties = {
    notebook_version: string,
    schema_version: string,
    name: string,
    lead_institution: string,
    pre_description: string,
    project_lead: string,
    project_status: string,
    // ---- 
    sections: any,
    access: any,
    accesses: string[],
    filenames: string[],
    forms: any,
    ispublic: boolean,
    isrequest: boolean,
    meta: any,
}

export type NotebookUISpec = {
    fields: any,
    fviews: any,
    viewsets: any,
    visible_types: string[]
}

export type Notebook = {
    metadata: NotebookMetadata,
    "ui-specification": NotebookUISpec
}

// an empty notebook
export const initialState: Notebook = {
    "metadata": {
        "notebook_version": "1.0",
        "schema_version": "1.0",
        "name": "",
        "access": {},
        "accesses": ["admin", "moderator", "team"],
        "filenames": [],
        "forms": {},
        "ispublic": false,
        "isrequest": false,
        "lead_institution": "",
        "meta": {},
        "pre_description": "",
        "project_lead": "",
        "project_status": "New",
        "sections": {}
    },
    "ui-specification": {
        "fields":{},
        "fviews": {},
        "viewsets": {},
        "visible_types": []
    }
}