import { Alert } from "@mui/material";
import { useAppSelector } from "../state/hooks";
import { JsonView, collapseAllNested, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

export const ReviewPanel = () => {

    const state = useAppSelector((state) => state);

    return (
        <div>
            <Alert severity="info">
              Here you can review the raw JSON notebook file. 
            </Alert>
            <JsonView 
                data={state} 
                shouldExpandNode={collapseAllNested} 
                style={defaultStyles}
             />
        </div>
    );
};