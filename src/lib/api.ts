import { CoffeeBean } from "@/components/CoffeeCard";

const API_URL = 'http://localhost:8000/api';

export async function fetchBeans() {
  const response = await fetch(`${API_URL}/beans`);
  if (!response.ok) {
    throw new Error('Failed to fetch beans');
  }
  return response.json();
}

export async function createBean(bean: Omit<CoffeeBean, "id">) {
  const response = await fetch(`${API_URL}/beans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: bean.name,
      roaster: bean.roaster,
      origin: bean.origin,
      roast_level: bean.roastLevel,
      price: bean.price,
      weight: bean.weight,
      rank: bean.rank,
      dose: bean.gramsIn,
      yield_ml: bean.mlOut,
      brew_time: bean.brewTime,
      temperature: bean.temperature,
      grind_size: String(bean.grindSize),
      order_again: bean.orderAgain ? "Yes" : "No",
      tasting_notes: bean.notes.join(", ")
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to create bean');
  }
  return response.json();
}

export async function updateBean(id: string, bean: Partial<CoffeeBean>) {
  const response = await fetch(`${API_URL}/beans/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bean),
  });
  if (!response.ok) {
    throw new Error('Failed to update bean');
  }
  return response.json();
}

export async function deleteBean(id: string) {
  const response = await fetch(`${API_URL}/beans/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete bean');
  }
  return response.json();
}