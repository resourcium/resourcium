import App from 'src/App';
import { create } from 'react-test-renderer';
import React from 'react';

test('app snapshot matches', () => {
    expect(create(<App />)).toMatchSnapshot();
});
