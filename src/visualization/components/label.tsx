import * as React from "react";

interface ILabelProps {
    label: string;
    value: any;
}

export const Label = (props: ILabelProps) => {
    return <div>
        <label>
            {
                props.label
            }
            </label>

        <span>
            {
                props.value
            }
        </span>
    </div>

}