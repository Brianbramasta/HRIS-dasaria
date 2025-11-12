import { renderHook, act } from '@testing-library/react';
import { useLogin } from '../useLogin';
import { authService } from '../../services/auth.service';
import * as authStoreModule from '../../stores/authStore';

// Mocks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('../../services/auth.service', () => ({
  authService: { login: jest.fn() },
}));

jest.mock('../../stores/authStore', () => {
  const mockSetAuth = jest.fn();
  return {
    useAuthStore: (selector: any) => selector({ setAuth: mockSetAuth }),
    __mockSetAuth: mockSetAuth,
  };
});
const mockSetAuth = (authStoreModule as any).__mockSetAuth as jest.Mock;

describe('useLogin - handleLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('navigates to intended_url and sets auth on success', async () => {
    localStorage.setItem('intended_url', '/dashboard');

    const fakeResponse = {
      user: { id: '1', email: 'admin@hris.com' },
      accessToken: 'access-token-123',
      refreshToken: 'refresh-token-456',
    };
    (authService.login as jest.Mock).mockResolvedValueOnce(fakeResponse);

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleLogin({ email: 'admin@hris.com', password: 'secret' } as any);
    });

    expect(authService.login).toHaveBeenCalledWith({ email: 'admin@hris.com', password: 'secret' });
    expect(mockSetAuth).toHaveBeenCalledWith({
      user: fakeResponse.user,
      accessToken: fakeResponse.accessToken,
      refreshToken: fakeResponse.refreshToken,
    });
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    expect(localStorage.getItem('intended_url')).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('sets proper error message for 401 and does not navigate', async () => {
    const error401 = { statusCode: 401 };
    (authService.login as jest.Mock).mockRejectedValueOnce(error401);

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleLogin({ email: 'wrong@hris.com', password: 'bad' } as any);
    });

    expect(authService.login).toHaveBeenCalledWith({ email: 'wrong@hris.com', password: 'bad' });
    expect(mockSetAuth).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(result.current.error).toBe('Invalid email or password. Please try again.');
    expect(result.current.isLoading).toBe(false);
  });
});