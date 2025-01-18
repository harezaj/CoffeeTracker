import { useState } from "react";
import { CoffeeCard, type CoffeeBean } from "@/components/CoffeeCard";
import { AddCoffeeForm } from "@/components/AddCoffeeForm";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [beans, setBeans] = useState<CoffeeBean[]>([]);
  const { toast } = useToast();

  const addBean = (newBean: Omit<CoffeeBean, "id">) => {
    const beanWithId = {
      ...newBean,
      id: Math.random().toString(36).substr(2, 9),
    };
    setBeans([...beans, beanWithId]);
    toast({
      title: "Coffee Bean Added",
      description: `${newBean.name} has been added to your collection.`,
    });
  };

  const getRecommendations = () => {
    if (beans.length === 0) return [];
    
    const highestRated = beans.reduce((max, bean) => 
      bean.rating > max.rating ? bean : max
    );

    return beans.filter(bean => 
      bean.id !== highestRated.id && 
      (bean.roastLevel === highestRated.roastLevel || 
       bean.origin === highestRated.origin)
    ).slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-light to-white">
      <div className="container py-12 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-coffee-dark to-coffee bg-clip-text text-transparent">
            Coffee Bean Journal
          </h1>
          <AddCoffeeForm onAdd={addBean} />
        </div>

        {beans.length === 0 ? (
          <div className="text-center py-16 bg-white/50 rounded-xl backdrop-blur-sm border border-cream">
            <p className="text-coffee text-xl">
              No coffee beans added yet. Start by adding your first coffee bean!
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            <section>
              <h2 className="text-3xl font-semibold text-coffee-dark mb-6 inline-block">
                Your Collection
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {beans.map((bean) => (
                  <CoffeeCard key={bean.id} bean={bean} />
                ))}
              </div>
            </section>

            {getRecommendations().length > 0 && (
              <section>
                <h2 className="text-3xl font-semibold text-coffee-dark mb-6 inline-block">
                  Recommended Based on Your Taste
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {getRecommendations().map((bean) => (
                    <CoffeeCard key={bean.id} bean={bean} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;