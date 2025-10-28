export default function SearchBar({ searchTerm, onSearchChange, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 flex">
      <input
        type="text"
        placeholder="주소, 장소 또는 키워드 입력..."
        className="w-full px-4 py-3 border rounded-l-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-3 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        검색
      </button>
    </form>
  );
}
