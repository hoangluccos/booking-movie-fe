import { Link } from "react-router-dom";

function SearchItem({ data }) {
  return (
    <Link
      to={`/movies/${data.id}`}
      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 transition duration-300"
    >
      <img
        className="w-10 h-10 object-cover rounded-md"
        src={data.image}
        alt={data.name}
      />
      <h4 className="text-sm font-medium text-gray-800">{data.name}</h4>
    </Link>
  );
}

export default SearchItem;
