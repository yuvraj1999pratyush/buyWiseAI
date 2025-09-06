import React from "react";
import "../styles/search-bar.css";

export default function SearchBar({
  query = "",
  onChange = "",
  onSearch = "",
  loading = "",
}) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Ask about your favourite amazon products"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
        disabled={loading}
      />
      <button onClick={onSearch} disabled={loading} className="search-button">
        Ask
      </button>
    </div>
  );
}
