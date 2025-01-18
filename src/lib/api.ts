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

// Update an existing bean in localStorage
export const updateBean = async (id: string, updates: Partial<Omit<CoffeeBean, "id">>): Promise<CoffeeBean> => {
  try {
    const beans = await fetchBeans();
    const index = beans.findIndex(bean => bean.id === id);
    if (index === -1) throw new Error('Bean not found');
    
    const updatedBean = { ...beans[index], ...updates };
    const updatedBeans = [...beans];
    updatedBeans[index] = updatedBean;
    
    localStorage.setItem('coffeeBeans', JSON.stringify(updatedBeans));
    console.log('Bean updated, new data:', updatedBean);
    return updatedBean;
  } catch (error) {
    console.error('Error updating bean:', error);
    throw error;
  }
};

// Delete a bean from localStorage
export const deleteBean = async (id: string): Promise<void> => {
  try {
    const beans = await fetchBeans();
    const updatedBeans = beans.filter(bean => bean.id !== id);
    localStorage.setItem('coffeeBeans', JSON.stringify(updatedBeans));
    console.log('Bean deleted, remaining beans:', updatedBeans);
  } catch (error) {
    console.error('Error deleting bean:', error);
    throw error;
  }
};