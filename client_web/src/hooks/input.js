import React, { useState } from 'react';

export function useInput({
    defaultValue = '',
    placeholder = '',
    type = 'text',
    ref = null,
    maxlength = null,
    properties = {},
    name = ''
} = {}) {
    let [value, setValue] = useState(defaultValue);

    const field = (
        <input
            value={value}
            type={type}
            placeholder={placeholder}
            onChange={e => setValue(e.target.value)}
            ref={ref}
            maxLength={maxlength}
            name={name}
            {...properties}
        />
    );

    return [value, field, setValue];
}

export function useCheckbox({
    defaultValue = false,
    ref = null,
    properties = {},
    name = ''
} = {}) {
    let [value, setValue] = useState(defaultValue);

    const field = (
        <input
            checked={value}
            type="checkbox"
            onChange={e => setValue(e.target.checked)}
            ref={ref}
            name={name}
            {...properties}
        />
    );

    return [value, field, setValue];
}
