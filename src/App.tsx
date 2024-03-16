import { useEffect, useRef, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
interface Iresults {
  results: any;
  pages: number;
  resultsPerPage: number;
}

interface IFetchParams {
  query?: string | undefined;
  page?: number | undefined;
  tag?: string | undefined;
}

const fetchData = async ({
  query = "",
  page = 0,
  tag = "",
}: IFetchParams): Promise<Iresults> => {
  return fetch(
    `https://hn.algolia.com/api/v1/search?query=${query}&tags=${encodeURIComponent(
      tag
    )}&page=${page}`
  )
    .then((response) => response.json())
    .then((json) => ({
      results: json.hits || [],
      pages: json.nbPages || 0,
      resultsPerPage: json.hitsPerPage || 20,
    }));
};

export default function HackerNewsSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [tag, setTag] = useState("story");
  const [page, setPage] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(0);
  const [totalPages, setTotalPages] = useState(50);
  const [loading, setLoading] = useState(false);

  const isFirstPage = page === 0;
  const isLastPage = page === results.length - 1;

  useEffect(() => {
    const handleFetchData = async () => {
      setLoading(true);
      setResults([]);
      const { results, pages, resultsPerPage } = await fetchData({
        query,
        page,
        tag,
      });
      setResults(results);
      setTotalPages(pages);
      setResultsPerPage(resultsPerPage);
      setLoading(false);
    };

    handleFetchData();
  }, [page]);

  console.log(results);
  console.log(page);
  console.log(resultsPerPage);

  const handleSearch = (e: any) => {
    setQuery(e.target.value);
    setPage(0);
  };

  const handleTag = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTag(e.target.value);
    setPage(0);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };
  return (
    <main>
      <h1>Hacker News Search</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="query">Search</label>
          <input
            type="text"
            id="query"
            name="query"
            value={query}
            onChange={handleSearch}
            placeholder="Search Hacker News..."
          />
        </div>
        <div>
          <label htmlFor="tag">Tag</label>
          <select id="tag" name="tag" onChange={handleTag} value={tag}>
            <option value="story">Story</option>
            <option value="ask_hn">Ask HN</option>
            <option value="show_hn">Show HN</option>
            <option value="poll">Poll</option>
          </select>
        </div>
      </form>
      <section>
        <header>
          <h2>
            <span>
              {results ? "page " + page + " of " + totalPages : "No Results"}
            </span>
            <RotatingLines
              strokeColor="grey"
              strokeWidth="5"
              animationDuration="0.75"
              width="20"
              visible={loading}
            />
          </h2>
          <div>
            <button
              className="link"
              onClick={handlePrevPage}
              disabled={isFirstPage}
            >
              Previous
            </button>
            <button
              className="link"
              onClick={handleNextPage}
              disabled={isLastPage}
            >
              Next
            </button>
          </div>
        </header>

        {results.map(({ url, objectID, title }, index) => {
          const href = url || "https://gatinhosfofos.com.br/";
          const position = resultsPerPage * page + index + 1;

          return (
            <li key={objectID}>
              <span>{position}.</span>
              <a href={href} target="_blank" rel="noreferrer">
                {title}
              </a>
            </li>
          );
        })}
      </section>
    </main>
  );
}
