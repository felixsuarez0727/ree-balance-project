import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ChartEmpty from "../../../src/components/Dashboard/ChartEmpty"

describe('ChartEmpty', () => {
  it('renders the title correctly', () => {
    render(<ChartEmpty title="No Data Found" />);

    expect(screen.getByText('No Data Found')).toBeInTheDocument();
  });

  it('shows the default message when there are no data', () => {
    render(<ChartEmpty title="Example Title" />);

    expect(screen.getByText('No hay datos disponibles')).toBeInTheDocument();
  });
});
