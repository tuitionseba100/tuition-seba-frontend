import { render, screen } from '@testing-library/react';
import App from './App';
import "@fontsource/poppins"; // Defaults to 400 weight
import "@fontsource/poppins/300.css"; // Light weight
import "@fontsource/poppins/600.css"; // Semi-bold


test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
