import { useState } from "react";
import Navbar from "./components/Navbar";
import { askQuestion } from "./api";
import "./App.css";
import SearchBar from "./components/SearchBar";
import Result from "./components/Result";

function App() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const onChange = (newQuery) => {
    setQuery(newQuery);
    setLoading(false);
    setError("");
  };

  const onSearch = async () => {
    console.log("clicked");
    if (!query.trim()) {
      setError("Please enter a valid question");
      setLoading(false);
      setAnswer("");
      setProducts([]);
      return;
    }

    setLoading(true);
    setError("");
    setAnswer("");
    setProducts([]);

    const startTime = Date.now();

    try {
      const data = await askQuestion(query);
      setAnswer(data.answer);
      setProducts(data.products || []);
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      const elapsed = Date.now() - startTime;
      const remaining = 1500 - elapsed;

      if (remaining > 0) {
        setTimeout(() => setLoading(false), remaining);
      } else {
        setLoading(false);
      }
    }
  };

  return (
    <div className="app">
      <Navbar />
      <SearchBar
        query={query}
        onChange={onChange}
        onSearch={onSearch}
        loading={loading}
      />
      <Result
        answer={answer}
        products={products}
        error={error}
        loading={loading}
      />
    </div>
  );
}

export default App;
