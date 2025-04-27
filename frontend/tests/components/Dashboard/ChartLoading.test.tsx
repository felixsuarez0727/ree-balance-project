import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ChartLoading from "../../../src/components/Dashboard/ChartLoading";

describe('ChartLoading', () => {
  it('renders the title correctly', () => {
    render(<ChartLoading title="Cargando datos" />);

    expect(screen.getByText('Cargando datos')).toBeInTheDocument();
  });

  it('shows the loading message', () => {
    render(<ChartLoading title="Loading Test" />);

    expect(screen.getByText('Cargando datos...')).toBeInTheDocument();
  });

});