import server from './api/api-services';

export const Test1Request = () => {
  return server({
    url: 'https://jsonplaceholder.typicode.com/posts',
    method: 'GET',
  })
}

export const Test2Request = (data:any) => {
  return server({
    url: 'https://jsonplaceholder.typicode.com/posts',
    method: 'POST',
    data: data
  })
}

export const Test3Request = (data:any, id:number) => {
  return server({
    url: `https://jsonplaceholder.typicode.com/posts/${id}`,
    method: 'PUT',
    data: data
  })
}

export const Test4Request = (id:number) => {
  return server({
    url: `https://jsonplaceholder.typicode.com/posts/${id}`,
    method: 'DELETE',
  })
}

export const Test1Request1 = () => {
  return server({
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    method: 'GET',
  })
}
