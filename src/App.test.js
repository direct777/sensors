import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react';
import App from './App';

test('renders welcome message', () => {
  act(() => {
    render(<App />);
  });
  const headingElement = screen.getByText(/Welcome to the Device Event Monitoring App/i);
  expect(headingElement).toBeInTheDocument();
});