function SearchForm({ onChangeValue }) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Tìm theo name, username"
        onChange={(e) => onChangeValue(e.target.value)}
        className="search-input"
      />
    </div>
  );
}

export default SearchForm;

