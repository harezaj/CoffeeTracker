import { Button } from "@/components/ui/button";

interface RankingSectionProps {
  currentRank: number;
  onRankChange: (value: number) => void;
}

export function RankingSection({ currentRank, onRankChange }: RankingSectionProps) {
  return (
    <div className="space-y-2">
      <label className="dark:text-gray-200">Rank</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <Button
            key={value}
            type="button"
            variant={currentRank >= value ? "default" : "outline"}
            className={`${currentRank >= value ? "dark:bg-coffee dark:text-white" : "dark:border-gray-700 dark:text-gray-300"}`}
            onClick={() => onRankChange(value)}
          >
            {value}
          </Button>
        ))}
      </div>
    </div>
  );
}