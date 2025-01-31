import { CoffeeCard, type CoffeeBean } from "./CoffeeCard";
import { CoffeeListItem } from "./CoffeeListItem";
import { AddCoffeeForm } from "./AddCoffeeForm";
import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "@/components/ui/input";

type SortField = 'name' | 'roaster' | 'rank';

interface CollectionTabProps {
  beans: CoffeeBean[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Omit<CoffeeBean, "id">>) => void;
  onAdd: (bean: Omit<CoffeeBean, "id">) => void;
  isLoading?: boolean;
}

export function CollectionTab({ beans, onDelete, onUpdate, onAdd, isLoading = false }: CollectionTabProps) {
  const [viewMode, setViewMode] = useState<'tiles' | 'list'>('tiles');
  const [selectedBean, setSelectedBean] = useState<CoffeeBean | null>(null);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRoaster, setSelectedRoaster] = useState<string>('all');
  const [selectedRank, setSelectedRank] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const uniqueRoasters = ['all', ...Array.from(new Set(beans.map(bean => bean.roaster)))];

  const filterBeans = (beans: CoffeeBean[]) => {
    return beans.filter(bean => {
      const roasterMatch = selectedRoaster === 'all' || bean.roaster === selectedRoaster;
      const rankMatch = selectedRank === 'all' || bean.rank === parseInt(selectedRank);
      const searchMatch = 
        searchQuery === '' || 
        bean.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bean.roaster.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bean.notes.some(note => note.toLowerCase().includes(searchQuery.toLowerCase()));
      return roasterMatch && rankMatch && searchMatch;
    });
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

  const filteredAndSortedBeans = sortBeans(filterBeans(beans));

  const handleCardClick = (event: React.MouseEvent, bean: CoffeeBean) => {
    const target = event.target as HTMLElement;
    
    // Check if clicking on card content vs interactive elements
    const isCardContent = target.closest('.card-content');
    const isAccordionTrigger = target.closest('[role="button"]') !== null;
    const isButton = target.closest('button') !== null;
    const isInput = target.closest('input') !== null;
    const isSelect = target.closest('select') !== null;
    
    // Only show dialog when clicking on card content, not on interactive elements
    if (isCardContent && !isAccordionTrigger && !isButton && !isInput && !isSelect) {
      setSelectedBean(bean);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Your Collection
          </h2>
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-10 w-32 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-96 bg-white dark:bg-[#121212] rounded-lg border border-gray-200 dark:border-gray-800 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Your Collection
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white dark:bg-[#171717] rounded-lg border border-gray-200 dark:border-gray-800 p-1">
            <Button
              variant={viewMode === 'tiles' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('tiles')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <AddCoffeeForm onAdd={onAdd} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <Input
          placeholder="Search beans..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <Select value={selectedRoaster} onValueChange={setSelectedRoaster}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by roaster" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roasters</SelectItem>
            {uniqueRoasters.slice(1).map(roaster => (
              <SelectItem key={roaster} value={roaster}>{roaster}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedRank} onValueChange={setSelectedRank}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            {[1, 2, 3, 4, 5].map(rank => (
              <SelectItem key={rank} value={rank.toString()}>{rank} Stars</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredAndSortedBeans.length === 0 ? (
        <div className="text-center py-16 bg-white/50 dark:bg-[#121212]/50 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-lg animate-fade-in">
          <p className="text-gray-600 dark:text-gray-300 text-xl">
            No coffee beans found matching your filters.
          </p>
        </div>
      ) : viewMode === 'tiles' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedBeans.map((bean) => (
            <div
              key={bean.id}
              onClick={(e) => handleCardClick(e, bean)}
              className="cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <div className="card-content">
                <CoffeeCard 
                  bean={bean} 
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#121212] rounded-lg border border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800">
          {filteredAndSortedBeans.map((bean) => (
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
              defaultExpandedAccordions={['bean-details', 'brew-details', 'cost-analysis']}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}