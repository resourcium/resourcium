import { create } from 'react-test-renderer';
import React from 'react';

import Links from 'src/components/Links';

import { wrapProvider } from 'src/tests/util';

test('links snapshot matches', () => {
    expect(create(wrapProvider(<Links />))).toMatchSnapshot();
});
