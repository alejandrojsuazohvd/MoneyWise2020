import React from 'react';
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App';
import { MemoryRouter } from 'react-router-dom'

jest.mock("@auth0/auth0-react")

import { useAuth0 } from '@auth0/auth0-react';

describe('navigation', () => {
  beforeEach(() => {
    (useAuth0 as jest.MockedFunction<() => any>).mockReturnValue({
      user: { given_name: 'James', sub: 'userid' },
      isLoading: false,
      isAuthenticated: true,
    })
  })

  it('should render homepage', () => {
    const { getByText } = render(<App />, { wrapper: MemoryRouter });
    const linkElement = getByText(/Take back your financial future/i);
    expect(linkElement).toBeInTheDocument();
  });

  it('should navigate to plan page', () => {
    const page = render(<App />, { wrapper: MemoryRouter });

    userEvent.click(page.getByText(/plan/i));

    expect(page.getByText(/Submit/i)).toBeInTheDocument();
  });
});
