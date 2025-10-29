export default function SearchBar({ searchTerm, onSearchChange, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 flex rounded-l-xl ">
      <input
        type="text"
        placeholder="주소, 장소 또는 키워드 입력..."
        className="w-full px-4 py-3 border rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </form>
  );
}
