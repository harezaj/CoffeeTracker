import { createClient } from '@supabase/supabase-js';
import type { CoffeeBean } from '@/components/CoffeeCard';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

const transformBeanFromDB = (bean: any): CoffeeBean => ({
  id: bean.id,
  name: bean.name,
  roaster: bean.roaster,
  origin: bean.origin,
  roastLevel: bean.roast_level,
  notes: bean.notes,
  generalNotes: bean.general_notes,
  rank: bean.rank,
  gramsIn: bean.grams_in,
  mlOut: bean.ml_out,
  brewTime: bean.brew_time,
  temperature: bean.temperature,
  price: bean.price,
  weight: bean.weight,
  orderAgain: bean.order_again,
  grindSize: bean.grind_size,
  purchaseCount: bean.purchase_count,
});

const transformBeanToDB = (bean: Omit<CoffeeBean, "id">) => ({
  name: bean.name,
  roaster: bean.roaster,
  origin: bean.origin,
  roast_level: bean.roastLevel,
  notes: bean.notes,
  general_notes: bean.generalNotes,
  rank: bean.rank,
  grams_in: bean.gramsIn,
  ml_out: bean.mlOut,
  brew_time: bean.brewTime,
  temperature: bean.temperature,
  price: bean.price,
  weight: bean.weight,
  order_again: bean.orderAgain,
  grind_size: bean.grindSize,
  purchase_count: bean.purchaseCount,
});

export const fetchBeans = async (): Promise<CoffeeBean[]> => {
  const { data, error } = await supabase
    .from('coffee_beans')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching beans:', error);
    throw error;
  }

  return data.map(transformBeanFromDB);
};

export const createBean = async (bean: Omit<CoffeeBean, "id">): Promise<CoffeeBean> => {
  const { data, error } = await supabase
    .from('coffee_beans')
    .insert([transformBeanToDB(bean)])
    .select()
    .single();

  if (error) {
    console.error('Error creating bean:', error);
    throw error;
  }

  return transformBeanFromDB(data);
};

export const updateBean = async (id: string, updates: Partial<Omit<CoffeeBean, "id">>): Promise<CoffeeBean> => {
  const { data, error } = await supabase
    .from('coffee_beans')
    .update(transformBeanToDB(updates as Omit<CoffeeBean, "id">))
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating bean:', error);
    throw error;
  }

  return transformBeanFromDB(data);
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