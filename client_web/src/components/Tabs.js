import React, { useState } from 'react';
import './Tabs.scss';
import classnames from 'classnames';

function TabLabels({ tabs, order, selected, onSelect }) {
    return (
        <div className="tabs-label-row">
            {order.map(key => (
                <div
                    className={classnames('tabs-label', {
                        selected: key == selected,
                    })}
                    key={key}
                    onClick={() => onSelect(key)}
                >
                    {tabs[key]['label']}
                </div>
            ))}
        </div>
    );
}

export default function Tabs({ tabs = {}, order = null }) {
    // We ignore any keys that don't have a value in tabs (including `null` values)
    // If order is missing keys then they won't be shown
    const derivedOrder = (order ? order : Object.keys(tabs)).filter(
        key => !!tabs[key]
    );
    const defaultKey = derivedOrder[0];
    const [selected, setSelected] = useState(defaultKey);

    return (
        <div className="tabs">
            <TabLabels
                tabs={tabs}
                selected={selected}
                onSelect={setSelected}
                order={derivedOrder}
            />
            <div className="tabs-content">
                {(tabs[selected] || {})['content']}
            </div>
        </div>
    );
}
