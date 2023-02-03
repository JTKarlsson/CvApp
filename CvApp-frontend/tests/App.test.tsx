import React from 'react';
import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { App } from '../src/App';

describe('App', () => {
    it('Renders CvApp', () => {
        // ARRANGE
        render(<App />);
        // ACT
        // EXPECT
        expect(
            screen.getByRole('heading', {
                level: 1
            })
        ).toHaveTextContent("CvApp");
    });

});
