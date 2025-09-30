type PaginationProps = {
  page: number;
  hasNext: boolean;
  onPage: (page: number) => void;
};

const Pagination = ({ page, hasNext, onPage }: PaginationProps) => {
  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="button"
        onClick={() => onPage(1)}
        disabled={page === 1}
      >
        « First
      </button>
      <button
        className="button"
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
      >
        ‹ Prev
      </button>
      <button className="button" aria-current="page">
        {page}
      </button>
      <button
        className="button"
        onClick={() => onPage(page + 1)}
        disabled={!hasNext}
      >
        Next ›
      </button>
    </nav>
  );
};

export default Pagination;
