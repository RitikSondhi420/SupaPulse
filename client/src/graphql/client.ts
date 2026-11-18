export const GRAPHQL_ENDPOINT =
  import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';

export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string; locations?: any[]; path?: string[] }>;
}

export function getStoredToken(): string | null {
  return localStorage.getItem('supapulse_auth_token');
}

export function setStoredToken(token: string | null): void {
  if (token) {
    localStorage.setItem('supapulse_auth_token', token);
  } else {
    localStorage.removeItem('supapulse_auth_token');
  }
}

export async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, any> = {},
  token?: string,
): Promise<T> {
  const authToken = token || getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const opMatch = query.match(/(mutation|query)\s+(\w+)/);
  const opName = opMatch ? `${opMatch[1]} ${opMatch[2]}` : 'GraphQL API';
  console.log(`🌐 [Network API Dispatch] -> POST ${GRAPHQL_ENDPOINT} (${opName})`, variables);

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL Network Error: ${response.status} ${response.statusText}`);
  }

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors.map((e) => e.message).join(' | '));
  }

  if (!result.data) {
    throw new Error('No data received from GraphQL endpoint');
  }

  return result.data;
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'query { __typename }' }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
