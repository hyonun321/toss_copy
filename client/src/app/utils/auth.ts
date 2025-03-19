export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = sessionStorage.getItem('authToken');

  const headers = {
    ...options.headers,
    Authorization: token || '',
    'Content-Type': 'application/json',
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

export function isAuthenticated(): boolean {
  if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
    return !!sessionStorage.getItem('authToken');
  }
  return false;
}
export async function logout(): Promise<void> {
  const token = sessionStorage.getItem('authToken');

  if (token) {
    try {
      await fetch('http://localhost:8080/logout', {
        method: 'POST',
        headers: {
          Authorization: token,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('nickname');
}
