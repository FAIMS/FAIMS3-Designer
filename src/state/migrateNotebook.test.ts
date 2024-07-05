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


import {vi, describe, expect, test } from 'vitest';
import { migrateNotebook, validateNotebook } from './migrateNotebook';
import { sampleNotebook } from '../test-notebook';

describe('Migrate Notebook Tests', () => {

    test('validate notebook', () => {
        
        const valid = validateNotebook(sampleNotebook);
        expect(valid).toBeTruthy();

        const invalidNotebook = {
            metadata: {},
            foo: {},
        }
        expect(() => validateNotebook(invalidNotebook))
            .toThrowError("");  // message is empty but errors in .messages
    });

    test('update labels', () => {

        const migrated = migrateNotebook(sampleNotebook);
        const fields = migrated['ui-specification'].fields;
        expect(fields['Type']['component-parameters'].label).toBe('Type');
        expect(fields['Type']['component-parameters'].InputLabelProps).toBe(undefined);

        expect(fields['Length-mm']['component-parameters'].label).toBe('Length (mm)');
        expect(fields['Length-mm']['component-parameters'].InputLabelProps).toBe(undefined);

        expect(fields['safety_hazard']['component-parameters'].label).toBe('Safety Hazard');
        expect(fields['safety_hazard']['component-parameters'].FormControlLabelProps).toBe(undefined);

        expect(fields['IGSN-QR-Code']['component-parameters'].label).toBe('IGSN QR Code');
        expect(fields['IGSN-QR-Code']['component-parameters'].FormLabelProps).toBe(undefined);

    })

    test('update annotation format', () => {

        const migrated = migrateNotebook(sampleNotebook);
        const fields = migrated['ui-specification'].fields;
        expect(fields['Type']?.meta?.annotation).toHaveProperty('label');
        expect(fields['Type']?.meta?.annotation).toHaveProperty('include');
        expect(fields['Type']?.meta).not.toHaveProperty('annotation_label');

    });

    test('update helperText', () => {

        const migrated = migrateNotebook(sampleNotebook);
        const fields = migrated['ui-specification'].fields; 

        expect(fields['Sample-Photograph']['component-parameters'].helperText).toBe('Take a photo');
        expect(fields['Sample-Photograph']['component-parameters'].helpertext).toBe(undefined);

        expect(fields['IGSN-QR-Code']['component-parameters'].helperText).toBe('Scan the pre-printed QR Code for this sample.');

    });


    test('update form descriptions', () => {

        const migrated = migrateNotebook(sampleNotebook);
        const fviews = migrated['ui-specification'].fviews; 

        expect(fviews['Primary-New-Section'].description).toBe('This description.');
        expect(fviews['Primary-Next-Section'].description).toBe('That description.');

        expect(migrated.metadata.sections).toBeUndefined();

    });


    test('not losing properties', () => {

        const migrated = migrateNotebook(sampleNotebook);
        const fields = migrated['ui-specification'].fields;
        Object.getOwnPropertyNames(fields).forEach((fieldName: string) =>  {
            expect(Object.getOwnPropertyNames(fields)).toContain(fieldName);
        });
    });
})