import { create } from 'react-test-renderer';
import React from 'react';

import Greetings from 'src/components/Greetings';

import { wrapProvider } from 'src/tests/util';

test('greetings snapshot matches', () => {
    expect(create(wrapProvider(<Greetings />))).toMatchSnapshot();
});
