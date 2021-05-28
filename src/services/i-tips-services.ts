import server from './api/api-services';

export const ItipsForUserRequest = (i:number) => {
  return server({
    url: `https://jsonplaceholder.typicode.com/posts/${i}`,
    method: 'GET',
    headers: {
      isLoading: false
    }
  })
}

export const ItipsForCustomerRequest = (i:number) => {
  return server({
    url: `https://jsonplaceholder.typicode.com/posts/${i}`,
    method: 'GET',
    headers: {
      isLoading: false
    }
  })
}

export const ItipsForProductRequest = (i:number) => {
  return server({
    url: `https://jsonplaceholder.typicode.com/posts/${i}`,
    method: 'GET',
    headers: {
      isLoading: false
    }
  })
}

export const ItipsForOrdersRequest = (i:number) => {
  return server({
    url: `https://jsonplaceholder.typicode.com/posts/${i}`,
    method: 'GET',
    headers: {
      isLoading: false
    }
  })
}
