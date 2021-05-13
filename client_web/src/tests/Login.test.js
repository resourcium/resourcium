import { create } from 'react-test-renderer';
import React from 'react';

import Login from 'src/pages/Login';

import { wrapProvider } from 'src/tests/util';

test('app snapshot matches', () => {
    expect(create(wrapProvider(<Login />))).toMatchSnapshot();
});
