import { CoffeeBean } from "@/components/CoffeeCard";

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Get beans from localStorage
export const fetchBeans = async (): Promise<CoffeeBean[]> => {
  const beans = localStorage.getItem('coffeeBeans');
  return beans ? JSON.parse(beans) : [];
};

// Save a new bean to localStorage
export const createBean = async (bean: Omit<CoffeeBean, "id">): Promise<CoffeeBean> => {
  const beans = await fetchBeans();
  const newBean = { ...bean, id: generateId() };
  localStorage.setItem('coffeeBeans', JSON.stringify([...beans, newBean]));
  return newBean;
};