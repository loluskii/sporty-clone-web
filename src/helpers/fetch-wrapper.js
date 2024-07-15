import { useAuthStore } from '@/stores'

export const fetchWrapper = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE'),
  patch: request('PATCH'),
  public_get: publicRequest('GET')
}

function request(method) {
  return (url, body, { credentials } = {}) => {
    const requestOptions = {
      method: method,
      headers: authHeader()
    }
    if (body) {
      requestOptions.headers['Content-Type'] = 'application/json'
      requestOptions.body = JSON.stringify(body)
    }
    if (credentials) {
      requestOptions.credentials = credentials
    }
    return fetch(url, requestOptions).then(handleResponse)
  }
}

function publicRequest(method) {
	return (url, body) => {
		const requestOptions = {
			method: method,
			headers: { Accept: 'application/json' },
		};
		if (body) {
			requestOptions.headers['Content-Type'] = 'application/json';
			requestOptions.body = JSON.stringify(body);
		}
		return fetch(url, requestOptions).then(handleResponse);
	};
}

function authHeader() {
  // return auth header with jwt if user is logged in and request is to the api url
  const { isAuthenticated, token } = useAuthStore()
  if (isAuthenticated) {
    // if it's not authenticated also (i.e. token is null), a 401 is fine
    return { Authorization: `Bearer ${token}` }
  } else {
    return {}
  }
}

async function handleResponse(response) {
  const isJson = response.headers?.get('content-type')?.includes('application/json')
  const data = isJson ? await response.json() : null

  // check for error response
  if (!response.ok) {
    const authStore = useAuthStore()
    if ([401, 403].includes(response.status) && authStore.isAuthenticated) {
      // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
      await authStore.logout()
      return
    }

    // get error message from body or default to response status
    const error = data ? (data.message ? data.message : JSON.stringify(data)) : response.status
    return Promise.reject(error)
  }

  return {
    data,
    status: response.status
  }
}
