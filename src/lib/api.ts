import { CoffeeBean } from "@/components/CoffeeCard";

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Get beans from localStorage
export const fetchBeans = async (): Promise<CoffeeBean[]> => {
  try {
    const beans = localStorage.getItem('coffeeBeans');
    console.log('Fetched beans from localStorage:', beans);
    return beans ? JSON.parse(beans) : [];
  } catch (error) {
    console.error('Error fetching beans:', error);
    return [];
  }
};

// Save a new bean to localStorage
export const createBean = async (bean: Omit<CoffeeBean, "id">): Promise<CoffeeBean> => {
  try {
    const beans = await fetchBeans();
    const newBean = { ...bean, id: generateId() };
    const updatedBeans = [...beans, newBean];
    console.log('Saving beans to localStorage:', updatedBeans);
    localStorage.setItem('coffeeBeans', JSON.stringify(updatedBeans));
    return newBean;
  } catch (error) {
    console.error('Error creating bean:', error);
    throw error;
  }
};