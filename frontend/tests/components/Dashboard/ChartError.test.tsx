import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ChartError from "../../../src/components/Dashboard/ChartError";

describe('ChartError', () => {
  it('renders the title correctly', () => {
    render(<ChartError title="Error en los datos" />);

    expect(screen.getByText('Error en los datos')).toBeInTheDocument();
  });

  it('shows the error message', () => {
    render(<ChartError title="Error Test" />);

    expect(screen.getByText('Error al cargar los datos')).toBeInTheDocument();
  });

});