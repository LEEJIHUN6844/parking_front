export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="mb-8">
      <input
        type="text"
        placeholder="주소, 장소 또는 키워드 입력..."
        className="w-full px-4 py-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
