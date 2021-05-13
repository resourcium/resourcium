import { create } from 'react-test-renderer';
import React from 'react';

import Forms from 'src/pages/Forms';

import { login } from 'src/tests/util';

test('forms snapshot matches', async () => {
    expect(create(await login(<Forms />))).toMatchSnapshot();
});
