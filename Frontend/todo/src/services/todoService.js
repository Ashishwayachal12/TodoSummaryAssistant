import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://16.170.7.63:8080/api/todos';

const todoService = {
  getAllTodos: () => axios.get(API_BASE_URL),
  createTodo: (todo) => axios.post(API_BASE_URL, todo),
  updateTodo: (id, todo) => axios.put(`${API_BASE_URL}/${id}`, todo),
  deleteTodo: (id) => axios.delete(`${API_BASE_URL}/${id}`),
  summarizeTodos: () => axios.post(`${API_BASE_URL}/summarize`),
};

export default todoService;
