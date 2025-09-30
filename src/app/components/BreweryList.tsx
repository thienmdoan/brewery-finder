import BreweryListItem from "./BreweryListItem";
import type { Brewery } from "../shared/utils.ts";

type BreweryListProps = {
  items: Brewery[];
  onSelect: (brewery: Brewery) => void;
};

const BreweryList = ({ items, onSelect }: BreweryListProps) => {
  return (
    <div className="list">
      {items.map((brewery) => (
        <BreweryListItem
          key={brewery.id ?? brewery.name}
          brewery={brewery}
          onClick={() => onSelect(brewery)}
        />
      ))}
    </div>
  );
};

export default BreweryList;
