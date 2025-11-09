import axios from 'axios';
import { Position } from '../types/position.types';

const API_URL = 'http://localhost:8000/api';

export const getPositions = async () => {
  const response = await axios.get(`${API_URL}/positions`);
  return response.data;
};

export const createPosition = async (position: Omit<Position, 'id'>) => {
  const response = await axios.post(`${API_URL}/positions`, position);
  return response.data;
};

export const updatePosition = async (id: string, position: Partial<Position>) => {
  const response = await axios.put(`${API_URL}/positions/${id}`, position);
  return response.data;
};

export const deletePosition = async (id: string) => {
  const response = await axios.delete(`${API_URL}/positions/${id}`);
  return response.data;
};