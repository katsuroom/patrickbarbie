import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AuthContextProvider, { AuthContext } from '../auth/index.js';

describe('AuthContextProvider', () => {
  it('provides auth context with loginUser function', () => {
    const TestComponent = () => {
      const { loginUser } = React.useContext(AuthContext);
      return (<button onClick={() => loginUser('test@test.com', 'password')}>Login</button>);
    };

    const mockLoginUser = jest.fn();

    const { getByText } = render(
      <AuthContext.Provider value={{ loginUser: mockLoginUser }}>
        <TestComponent />
      </AuthContext.Provider>
    );

    fireEvent.click(getByText('Login'));

    expect(mockLoginUser).toHaveBeenCalledWith('test@test.com', 'password');
  });


});
