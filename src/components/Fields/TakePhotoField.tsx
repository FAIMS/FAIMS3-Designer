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