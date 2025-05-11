import imgUserTmp from "../../assets/profile.png";

function ActorComponent({ name, image }) {
  return (
    <div className="flex max-w-[160px] h-[40px] items-center bg-slate-300 rounded-md px-1">
      <div className="h-[40px] rounded-md">
        <img
          src={image}
          alt=""
          className="w-full h-full rounded-md"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = imgUserTmp;
          }}
        />
      </div>
      <p className="my-auto">{name}</p>
    </div>
  );
}

export default ActorComponent;
