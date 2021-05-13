import { create } from 'react-test-renderer';
import React from 'react';

import Wellbeing from 'src/pages/Wellbeing';

import { wrapProvider } from 'src/tests/util';

test('greetings snapshot matches', () => {
    expect(create(wrapProvider(<Wellbeing />))).toMatchSnapshot();
});
