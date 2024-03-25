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

import { describe, expect, test } from 'vitest';
import {render, screen} from '@testing-library/react';
import {ConditionControl} from './condition';
import {sampleNotebook} from '../test-notebook';
import { store } from '../state/store';
import { Provider } from 'react-redux';
import { ThemeProvider } from "@mui/material/styles";
import globalTheme from "../theme/index";
import { ReactNode } from 'react';

const WithProviders = ({children}: {children: ReactNode}) => (
    <ThemeProvider theme={globalTheme}>
        <Provider store={store}>
            {children}
        </Provider>
    </ThemeProvider>
    );

describe('Info Panel',  () => {
    test('render the info panel', () => { 

        store.dispatch({ type: 'ui-specification/loaded', payload: sampleNotebook['ui-specification'] })
        const condition = {
            operator: 'equal',
            field: 'Sample-Location',
            value: 100,
        };
        render (
            <WithProviders>
                <ConditionControl initial={condition}/>
            </WithProviders>
        )

        expect(screen.getByTestId('field-input')).toBeDefined();
        expect(screen.getByTestId('operator-input')).toBeDefined();
        expect(screen.getByTestId('value-input')).toBeDefined();
        
        // act(() => {
        //     const metaName = screen.getByLabelText('Metadata Field Name');
        //     const metaValue = screen.getByLabelText('Metadata Field Value');
        //     fireEvent.change(metaName, { target: { value: 'Bob' } });
        //     fireEvent.change(metaValue, { target: { value: 'Bobalooba' } });
        //     const createButton = screen.getByText('Create New Field');
        //     createButton.click();
        //     expect(store.getState().metadata.Bob).toBe('Bobalooba');
        // });
    })
})