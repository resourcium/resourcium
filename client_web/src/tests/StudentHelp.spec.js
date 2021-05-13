import { create } from 'react-test-renderer';
import React from 'react';

import StudentHelp from 'src/pages/StudentHelp';

import { wrapProvider } from 'src/tests/util';

test('greetings snapshot matches', () => {
    expect(create(wrapProvider(<StudentHelp />))).toMatchSnapshot();
});