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
import {act, fireEvent, render, screen} from '@testing-library/react';
import {ConditionControl, ConditionType} from './condition';
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

describe('ConditionControl',  () => {
    test('render and interact with a field condition', () => { 

        store.dispatch({ type: 'ui-specification/loaded', payload: sampleNotebook['ui-specification'] })
        const condition = {
            operator: 'equal',
            field: 'Sample-Location',
            value: 100,
        };

        const onChangeFn = vi.fn();
        render (
            <WithProviders>
                <ConditionControl initial={condition} onChange={onChangeFn}/>
            </WithProviders>
        )

        expect(screen.getByTestId('field-input')).toBeDefined();
        expect(screen.getByTestId('operator-input')).toBeDefined();
        expect(screen.getByTestId('value-input')).toBeDefined();
        
        act(() => {
            const fieldInput = screen.getByTestId('field-input').querySelector('input');
            const opInput = screen.getByTestId('operator-input').querySelector('input');
            const valueInput = screen.getByTestId('value-input').querySelector('input');
            if (fieldInput && valueInput) {
                fireEvent.change(fieldInput, { target: { value: 'New-Text-Field' } });
                expect(onChangeFn).toHaveBeenCalled();
                expect(onChangeFn.mock.lastCall).toStrictEqual([
                    {
                        field: "New-Text-Field", 
                        operator: "equal",
                        value: 100,
                    }]
                );
                fireEvent.change(valueInput, { target: { value: 'Bobalooba' } });
                expect(onChangeFn.mock.lastCall).toStrictEqual([
                    {
                        field: "New-Text-Field", 
                        operator: "equal",
                        value: 'Bobalooba',
                    }]
                );
                fireEvent.change(opInput, { target: { value: 'not-equal' } });
                expect(onChangeFn.mock.lastCall).toStrictEqual([
                    {
                        field: "New-Text-Field", 
                        operator: "not-equal",
                        value: 'Bobalooba',
                    }]
                );
            };
        });
    });

    test('make a boolean condition from a field', () => { 

        store.dispatch({ type: 'ui-specification/loaded', payload: sampleNotebook['ui-specification'] })
        const condition = {
            operator: 'equal',
            field: 'Sample-Location',
            value: 100,
        };

        const onChangeFn = vi.fn();
        render (
            <WithProviders>
                <ConditionControl initial={condition} onChange={onChangeFn}/>
            </WithProviders>
        )
        
        act(() => {
            const splitButton = screen.getByTestId('split-button');
            if (splitButton) {
                fireEvent.click(splitButton);
                expect(onChangeFn).toHaveBeenCalled();
                const last = onChangeFn.mock.lastCall as ConditionType[];
                expect(last[0].operator).toBe('and');
                expect(last[0].conditions?.length).toBe(2);
            };
        });
    });
});
