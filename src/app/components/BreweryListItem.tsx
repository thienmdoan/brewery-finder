import type { Brewery } from "../shared/utils.ts";

type BreweryListItemProps = {
  brewery: Brewery;
  onClick: () => void;
};

const BreweryListItem = ({ brewery, onClick }: BreweryListItemProps) => {
  return (
    <div
      className="item"
      role="button"
      onClick={onClick}
      aria-label={`Open details for ${brewery.name}`}
    >
      <div>
        <div>
          <strong>{brewery.name}</strong>{" "}
          {brewery.brewery_type && (
            <span className="badge">{brewery.brewery_type}</span>
          )}
        </div>
        <div className="meta">
          {brewery.city}, {brewery.state}
        </div>
      </div>
      <div>›</div>
    </div>
  );
};

export default BreweryListItem;
