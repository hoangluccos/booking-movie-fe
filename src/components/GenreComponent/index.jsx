import { Link } from "react-router-dom";

function GenreComponent({ idGenre, name }) {
  return (
    <Link
      to={`/genre_page/${idGenre}`}
      className="border border-gray-200 rounded-xl py-2 px-2 shadow-black shadow-sm"
    >
      <p className="text-md my-auto ease-in-out duration-200 transition-transform hover:font-bold">
        {name}
      </p>
    </Link>
  );
}

export default GenreComponent;
