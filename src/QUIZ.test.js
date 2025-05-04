import { render, screen } from '@testing-library/react';
import QUIZ from './QUIZ';

test('renders learn react link', () => {
  render(<QUIZ />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
