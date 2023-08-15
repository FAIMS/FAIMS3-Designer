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

import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InfoPanel } from './info-panel';
import userEvent from '@testing-library/user-event'


const initial = {
    "name": "Blue Mountains Survey",
    "access": {
        "accessFORM1": ["admin"],
        "accessFORM2": ["admin"],
        "accessFORM3": ["admin"]
    },
    "accesses":   ["admin", "moderator", "team"],
    "filenames": [],
    "forms": {
        "FORM1":
        {
            "submitActionFORM1": "Save and New",
            "annotationFORM1": true,
            "uncertaintyFORM1": false,
            "formaccessinheritFORM1": false,
            "visibleFORM1": true
        },
        "FORM2":
        {
            "submitActionFORM2": "Save and New",
            "annotationFORM2": true,
            "uncertaintyFORM2": false,
            "formaccessinheritFORM2": false,
            "visibleFORM2": true
        },
        "FORM3":
        {
            "submitActionFORM3": "Save and New",
            "annotationFORM3": true,
            "uncertaintyFORM3": false,
            "formaccessinheritFORM3": false,
            "visibleFORM3": true
        }
    },
    "ispublic": false,
    "isrequest": false,
    "lead_institution": "Macquarie University",
    "meta": {},
    "pre_description": "This notebook was created for the field survey of the Nellies Glen and Ruined Castle areas located in the Blue Mountains National Park as part of the Australian Research Council Linkage project History, heritage and environmental change in a deindustrialised landscape led by Associate Professor Tanya Evans, Macquarie University, Sydney, Australia, in partnership with the Blue Mountains World Heritage Institute, Lantern Heritage and Mountains Heritage. The project investigates a 19th-century shale-mining community in Jamison Valley through archaeological and archival research complemented by oral histories. The notebook has been designed for field survey of the historic mining heritage site in the Jamison Valley, near Katoomba.",
    "project_lead": "Penny Crook",
    "project_status": "New",
    "sections": {}
};

describe('Info Panel', () => {
    test('render the info panel', () => {

        const user = userEvent.setup()

        const updateHandler = vi.fn();

        render(<InfoPanel initial={initial} updateHandler={updateHandler}/>);

        expect(screen.getByText('General Information')).toBeDefined();
        expect(updateHandler).toHaveBeenCalledTimes(0);

        const name = screen.getByTestId('name');
        expect(name).toBeDefined();
        name.focus();
        user.keyboard('New Name');
        //expect(updateHandler).toHaveBeenCalledTimes(1);       

    })
})