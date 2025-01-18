import { CoffeeBean } from "@/components/CoffeeCard";

const API_URL = 'http://localhost:8000/api';

// Transform backend data to frontend format
function transformBeanFromBackend(bean: any): CoffeeBean {
  return {
    id: bean.id.toString(),
    name: bean.name,
    roaster: bean.roaster,
    origin: bean.origin,
    roastLevel: bean.roast_level,
    price: bean.price,
    weight: bean.weight,
    rank: bean.rank,
    gramsIn: bean.dose,
    mlOut: bean.yield_ml,
    brewTime: bean.brew_time,
    temperature: bean.temperature,
    grindSize: parseInt(bean.grind_size),
    orderAgain: bean.order_again === "Yes",
    notes: bean.tasting_notes ? bean.tasting_notes.split(", ") : []
  };
}

export async function fetchBeans(): Promise<CoffeeBean[]> {
  const response = await fetch(`${API_URL}/beans`);
  if (!response.ok) {
    throw new Error('Failed to fetch beans');
  }
  const data = await response.json();
  return data.map(transformBeanFromBackend);
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
  const data = await response.json();
  return transformBeanFromBackend(data);
}

export async function updateBean(id: string, bean: Partial<CoffeeBean>) {
  const response = await fetch(`${API_URL}/beans/${id}`, {
    method: 'PUT',
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
      grind_size: bean.grindSize ? String(bean.grindSize) : undefined,
      order_again: bean.orderAgain !== undefined ? (bean.orderAgain ? "Yes" : "No") : undefined,
      tasting_notes: bean.notes ? bean.notes.join(", ") : undefined
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to update bean');
  }
  const data = await response.json();
  return transformBeanFromBackend(data);
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