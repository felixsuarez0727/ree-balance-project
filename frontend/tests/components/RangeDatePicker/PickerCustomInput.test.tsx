import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import PickerCustomInput from '../../../src/components/RangeDatePicker/PickerCustomInput';

describe('PickerCustomInput', () => {
  it('renders the placeholder when no value is provided', () => {
    render(
      <PickerCustomInput 
        placeholder="Seleccionar fecha" 
        onClear={jest.fn()} 
      />
    );

    expect(screen.getByText('Seleccionar fecha')).toBeInTheDocument();
  });

  it('renders the value when provided', () => {
    render(
      <PickerCustomInput 
        value="01/01/2023" 
        placeholder="Seleccionar fecha" 
        onClear={jest.fn()} 
      />
    );

    expect(screen.getByText('01/01/2023')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = jest.fn();
    const { container } = render(
      <PickerCustomInput 
        placeholder="Seleccionar fecha" 
        onClick={mockOnClick} 
        onClear={jest.fn()}
      />
    );

    fireEvent.click(container.firstChild as HTMLElement);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('renders clear button when value is provided', () => {
    render(
      <PickerCustomInput 
        value="01/01/2023" 
        placeholder="Seleccionar fecha" 
        onClear={jest.fn()}
      />
    );

    const clearButton = screen.getByRole('button');
    expect(clearButton).toBeInTheDocument();
  });

  it('does not render clear button when no value is provided', () => {
    render(
      <PickerCustomInput 
        placeholder="Seleccionar fecha" 
        onClear={jest.fn()}
      />
    );

    const clearButton = screen.queryByRole('button');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('calls onClear when clear button is clicked', () => {
    const mockOnClear = jest.fn();
    render(
      <PickerCustomInput 
        value="01/01/2023" 
        placeholder="Seleccionar fecha" 
        onClear={mockOnClear}
      />
    );

    const clearButton = screen.getByRole('button');
    fireEvent.click(clearButton);
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });
});