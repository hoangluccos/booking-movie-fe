import { Link } from "react-router-dom";
import imgUserTmp from "../../assets/profile.png";

function ActorComponent({ idPerson, name, image }) {
  return (
    <Link
      to={`/person_page/${idPerson}`}
      className="flex max-w-[160px] h-[40px] items-center bg-slate-200 shadow-sm  rounded-md px-1 transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg"
    >
      <div className="h-[40px] rounded-full">
        <img
          src={image}
          alt=""
          className="w-full h-full rounded-full object-cover"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = imgUserTmp;
          }}
        />
      </div>
      <p className="my-auto transition-colors duration-200 text-gray-600 hover:text-gray-800">
        {name}
      </p>
    </Link>
  );
}

export default ActorComponent;
