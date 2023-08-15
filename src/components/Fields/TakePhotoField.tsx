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

import { useAppSelector, useAppDispatch } from "../../state/hooks";
import { BaseFieldEditor } from "./BaseFieldEditor"

const sample = {
    "component-namespace": "faims-custom",
    "component-name": "TakePhoto",
    "type-returned": "faims-attachment::Files",
    "component-parameters":
    {
        "fullWidth": true,
        "name": "newfieldcce6babf",
        "id": "newfieldcce6babf",
        "helperText": "Take a photo",
        "variant": "outlined",
        "label": "Take Photo"
    },
    "validationSchema": [["yup.object"], ["yup.nullable"]],
    "initialValue": null,
    "access":["admin"],
    "meta":
    {
        "annotation_label": "annotation",
        "annotation": true,
        "uncertainty":
        {
            "include": false,
            "label": "uncertainty"
        }
    }
}

export const TakePhotoFieldEditor = ({fieldName}) => {
    const field = useAppSelector(state => state['ui-specification'].fields[fieldName]);
    const dispatch = useAppDispatch();

    return (
        <BaseFieldEditor
            fieldName={fieldName}
            children={undefined}
        />
    )
}