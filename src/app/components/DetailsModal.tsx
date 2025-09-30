import type { MouseEventHandler } from "react";
import type { Brewery } from "../shared/utils.ts";

type DetailsModalProps = {
  brewery: Brewery;
  onClose: () => void;
};

const DetailsModal = ({ brewery, onClose }: DetailsModalProps) => {
  const handleModalClick: MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={handleModalClick}>
        <button className="button close" onClick={onClose} aria-label="Close">
          Close
        </button>
        <h2>{brewery.name}</h2>
        <p className="meta">
          {brewery.brewery_type} — {brewery.city}, {brewery.state}
        </p>
        <ul>
          {brewery.street && (
            <li>
              <strong>Address:</strong> {brewery.street}, {brewery.city ?? ""},{" "}
              {brewery.state ?? ""}
              {brewery.postal_code ? ` ${brewery.postal_code}` : ""}
            </li>
          )}
          {brewery.phone && (
            <li>
              <strong>Phone:</strong> {brewery.phone}
            </li>
          )}
          {brewery.website_url && (
            <li>
              <strong>Website:</strong>{" "}
              <a href={brewery.website_url} target="_blank" rel="noreferrer">
                {brewery.website_url}
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DetailsModal;
