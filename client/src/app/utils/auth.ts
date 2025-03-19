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

export async function isAuthenticated(): Promise<boolean> {
  if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
    const token = sessionStorage.getItem('authToken');

    if (!token) return false;

    try {
      const response = await fetch('http://localhost:8080/validateToken', {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.valid === true;
      }

      return false;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
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
