import { useState } from "react";
import { Link } from "react-router-dom";
import { CoffeeCard, type CoffeeBean } from "@/components/CoffeeCard";
import { AddCoffeeForm } from "@/components/AddCoffeeForm";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

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
      bean.rank > max.rank ? bean : max
    );

    return beans.filter(bean => 
      bean.id !== highestRated.id && 
      (bean.roastLevel === highestRated.roastLevel || 
       bean.origin === highestRated.origin)
    ).slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container py-12 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              Coffee Bean Journal
            </h1>
            <p className="text-gray-600 text-lg">
              Track your coffee journey and discover new favorites
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/recommendations">
              <Button variant="outline">Get AI Recommendations</Button>
            </Link>
            <AddCoffeeForm onAdd={addBean} />
          </div>
        </div>

        {beans.length === 0 ? (
          <div className="text-center py-16 bg-white/50 rounded-xl backdrop-blur-sm border border-gray-200 shadow-lg animate-fade-in">
            <p className="text-gray-600 text-xl">
              No coffee beans added yet. Start by adding your first coffee bean!
            </p>
          </div>
        ) : (
          <div className="space-y-12 animate-fade-in">
            <section>
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">
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
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">
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