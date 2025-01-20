import { CoffeeBean } from "@/components/CoffeeCard";
import { supabase } from "@/integrations/supabase/client";

export const fetchBeans = async (): Promise<CoffeeBean[]> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('coffee_beans')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching beans:', error);
    throw error;
  }

  return data.map(bean => ({
    id: bean.id,
    name: bean.name,
    roaster: bean.roaster,
    origin: bean.origin,
    roastLevel: bean.roast_level,
    notes: bean.notes || [],
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
  }));
};

export const createBean = async (bean: Omit<CoffeeBean, "id">): Promise<CoffeeBean> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('coffee_beans')
    .insert([{
      user_id: session.session.user.id,
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
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating bean:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    roaster: data.roaster,
    origin: data.origin,
    roastLevel: data.roast_level,
    notes: data.notes || [],
    generalNotes: data.general_notes,
    rank: data.rank,
    gramsIn: data.grams_in,
    mlOut: data.ml_out,
    brewTime: data.brew_time,
    temperature: data.temperature,
    price: data.price,
    weight: data.weight,
    orderAgain: data.order_again,
    grindSize: data.grind_size,
    purchaseCount: data.purchase_count,
  };
};

export const updateBean = async (id: string, updates: Partial<Omit<CoffeeBean, "id">>): Promise<CoffeeBean> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('coffee_beans')
    .update({
      name: updates.name,
      roaster: updates.roaster,
      origin: updates.origin,
      roast_level: updates.roastLevel,
      notes: updates.notes,
      general_notes: updates.generalNotes,
      rank: updates.rank,
      grams_in: updates.gramsIn,
      ml_out: updates.mlOut,
      brew_time: updates.brewTime,
      temperature: updates.temperature,
      price: updates.price,
      weight: updates.weight,
      order_again: updates.orderAgain,
      grind_size: updates.grindSize,
      purchase_count: updates.purchaseCount,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating bean:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    roaster: data.roaster,
    origin: data.origin,
    roastLevel: data.roast_level,
    notes: data.notes || [],
    generalNotes: data.general_notes,
    rank: data.rank,
    gramsIn: data.grams_in,
    mlOut: data.ml_out,
    brewTime: data.brew_time,
    temperature: data.temperature,
    price: data.price,
    weight: data.weight,
    orderAgain: data.order_again,
    grindSize: data.grind_size,
    purchaseCount: data.purchase_count,
  };
};

export const deleteBean = async (id: string): Promise<void> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('coffee_beans')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting bean:', error);
    throw error;
  }
};