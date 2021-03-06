
import * as React from 'react';

import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

import { ISearchFieldComponentProps } from 'rev-ui/lib/fields/SearchField';
import { getGridWidthProps } from '../fields/utils';
import { IObject } from 'rev-models/lib/utils/types';

export const MUIDateSearchField: React.StatelessComponent<ISearchFieldComponentProps> = (props) => {

    const gridWidthProps = getGridWidthProps(props);
    const fieldId = props.field.name;

    let valueFrom = '';
    let valueTo = '';
    const criteria: IObject = props.criteria;
    if (criteria) {
        if (typeof criteria['_gte'] == 'string') {
            valueFrom = criteria['_gte'];
        }
        if (typeof criteria['_lte'] == 'string') {
            valueTo = criteria['_lte'];
        }
    }

    function onChange(newValueFrom: string, newValueTo: string) {
        if (newValueFrom || newValueTo) {
            const newCriteria: IObject = {};
            if (newValueFrom) {
                newCriteria['_gte'] = newValueFrom;
            }
            if (newValueTo) {
                newCriteria['_lte'] = newValueTo;
            }
            props.onCriteriaChange(newCriteria);
        }
        else {
            props.onCriteriaChange(null);
        }
    }

    return (
        <Grid item {...gridWidthProps} style={props.style}>
            <div style={{ display: 'flex' }}>
                <FormControl fullWidth>
                    <InputLabel
                        htmlFor={fieldId + '_from'}
                        shrink={true}
                    >
                        {props.label}
                    </InputLabel>
                    <Input
                        id={fieldId + '_from'}
                        type="date"
                        value={valueFrom}
                        onChange={(event) => onChange(event.target.value, valueTo)}
                    />
                </FormControl>
                <FormControl fullWidth style={{ marginLeft: 8 }}>
                    <InputLabel
                        htmlFor={fieldId + '_to'}
                        shrink={true}
                    >
                        to
                    </InputLabel>
                    <Input
                        id={fieldId + '_to'}
                        type="date"
                        value={valueTo}
                        onChange={(event) => onChange(valueFrom, event.target.value)}
                    />
                </FormControl>
            </div>
        </Grid>
    );
};
