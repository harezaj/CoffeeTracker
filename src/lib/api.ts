import { CoffeeBean } from "@/components/CoffeeCard";
import { supabase } from "./supabase";

export const fetchBeans = async (): Promise<CoffeeBean[]> => {
  const { data, error } = await supabase
    .from('coffee_beans')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching beans:', error);
    throw error;
  }

  return data.map(bean => ({
    ...bean,
    id: bean.id,
    notes: bean.notes || [],
  }));
};

export const createBean = async (bean: Omit<CoffeeBean, "id">): Promise<CoffeeBean> => {
  const { data, error } = await supabase
    .from('coffee_beans')
    .insert([bean])
    .select()
    .single();

  if (error) {
    console.error('Error creating bean:', error);
    throw error;
  }

  return {
    ...data,
    notes: data.notes || [],
  };
};

export const updateBean = async (id: string, updates: Partial<Omit<CoffeeBean, "id">>): Promise<CoffeeBean> => {
  const { data, error } = await supabase
    .from('coffee_beans')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating bean:', error);
    throw error;
  }

  return {
    ...data,
    notes: data.notes || [],
  };
};

export const deleteBean = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('coffee_beans')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting bean:', error);
    throw error;
  }
};

export const importCoffeeBeans = async (beans: Omit<CoffeeBean, "id">[]): Promise<void> => {
  const { error } = await supabase
    .from('coffee_beans')
    .insert(beans);

  if (error) {
    console.error('Error importing beans:', error);
    throw error;
  }
};