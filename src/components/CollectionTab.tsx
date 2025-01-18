import { CoffeeCard, type CoffeeBean } from "./CoffeeCard";
import { CoffeeListItem } from "./CoffeeListItem";
import { AddCoffeeForm } from "./AddCoffeeForm";
import { useState } from "react";
import { LayoutGrid, List, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type SortField = 'name' | 'roaster' | 'rank';

interface CollectionTabProps {
  beans: CoffeeBean[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Omit<CoffeeBean, "id">>) => void;
  onAdd: (bean: Omit<CoffeeBean, "id">) => void;
}

export function CollectionTab({ beans, onDelete, onUpdate, onAdd }: CollectionTabProps) {
  const [viewMode, setViewMode] = useState<'tiles' | 'list'>('tiles');
  const [selectedBean, setSelectedBean] = useState<CoffeeBean | null>(null);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortBeans = (beans: CoffeeBean[]) => {
    return [...beans].sort((a, b) => {
      const modifier = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'rank') {
        return (b.rank - a.rank) * modifier;
      }
      return a[sortField].localeCompare(b[sortField]) * modifier;
    });
  };

  const sortedBeans = sortBeans(beans);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-gray-900">
          Your Collection
        </h2>
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Sort by <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleSort('name')}>
                Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('roaster')}>
                Roaster {sortField === 'roaster' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('rank')}>
                Ranking {sortField === 'rank' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'tiles' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('tiles')}
              className="rounded-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="rounded-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <AddCoffeeForm onAdd={onAdd} />
        </div>
      </div>

      {beans.length === 0 ? (
        <div className="text-center py-16 bg-white/50 rounded-xl backdrop-blur-sm border border-gray-200 shadow-lg animate-fade-in">
          <p className="text-gray-600 text-xl">
            No coffee beans added yet. Start by adding your first coffee bean!
          </p>
        </div>
      ) : viewMode === 'tiles' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedBeans.map((bean) => (
            <CoffeeCard 
              key={bean.id} 
              bean={bean} 
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          {sortedBeans.map((bean) => (
            <CoffeeListItem
              key={bean.id}
              bean={bean}
              onClick={() => setSelectedBean(bean)}
            />
          ))}
        </div>
      )}

      <Dialog open={!!selectedBean} onOpenChange={() => setSelectedBean(null)}>
        <DialogContent className="max-w-3xl">
          {selectedBean && (
            <CoffeeCard
              bean={selectedBean}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}