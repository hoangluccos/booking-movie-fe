import React, { useState, useEffect } from "react";
import instance from "../../../api/instance";
import SuccessModal from "../../../components/SuccessModal";
import { useParams } from "react-router-dom";
import { parse, format } from "date-fns"; // Thư viện date-fns
const MovieForm = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái để hiển thị modal
  const [modalData, setModalData] = useState({ title: "", detail: "" }); // Dữ liệu cho modal
  const [formData, setFormData] = useState({
    name: "",
    premiere: "",
    language: "",
    duration: "",
    content: "",
    rate: "",
    genresId: [],
    directorId: "",
    actorsId: [],
  });
  const [image, setImage] = useState(null); // Lưu trữ ảnh tải lên
  const [preview, setPreview] = useState(null); // URL xem trước ảnh
  const [actors, setActors] = useState([]); // Dữ liệu cho combobox Actors
  const [directors, setDirectors] = useState([]); // Dữ liệu cho combobox Directors
  const [genres, setGenres] = useState([]); // Dữ liệu cho combobox Directors
  const [isFormDataReady, setIsFormDataReady] = useState(false); // Đánh dấu dữ liệu đã sẵn sàng

  const mapMovieDataToFormData = (apiResponse) => {
    const movie = apiResponse.result;
    // Xử lý định dạng ngày premiere
    let premiere = "";
    try {
      // Kiểm tra và chuyển đổi từ định dạng "DD-MM-YYYY" hoặc giữ nguyên "YYYY-MM-DD"
      if (movie.premiere.includes("-")) {
        if (movie.premiere.split("-")[0].length === 4) {
          // Đã đúng dạng "YYYY-MM-DD"
          premiere = movie.premiere;
        } else {
          // Chuyển từ "DD-MM-YYYY" sang "YYYY-MM-DD"
          const parsedDate = parse(movie.premiere, "dd-MM-yyyy", new Date());
          premiere = format(parsedDate, "yyyy-MM-dd");
        }
      }
    } catch (error) {
      console.error("Error parsing premiere date:", error);
    }
    return {
      id: movie.id,
      name: movie.name,
      premiere: premiere,
      language: movie.language,
      duration: movie.duration,
      content: movie.content,
      rate: movie.rate,
      image: movie.image,
      genresId: movie.genres,
      directorId: movie.director.id,
      actorsId: movie.actors,
    };
  };

  // Lấy dữ liệu phim khi đang chỉnh sửa
  useEffect(() => {
    if (id) {
      const fetchMovieData = async () => {
        try {
          const res = await instance.get(`/movies/${id}`);
          console.log(res.data.result);
          if (res.data.code === 200) {
            const formData = mapMovieDataToFormData(res.data);
            setFormData({
              ...formData,
              premiere: formData.premiere
                ? new Date(formData.premiere).toISOString().split("T")[0]
                : "",
            });
            setPreview(formData.image);
            setIsFormDataReady(true);
          }
        } catch (error) {
          console.error("Error fetching movie data:", error);
        }
      };
      fetchMovieData();
    } else {
      setIsFormDataReady(true);
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [actorsResponse, directorsResponse, genreResponse] =
          await Promise.all([
            instance.get("/persons/", { params: { jobName: "Actor" } }),
            instance.get("/persons/", { params: { jobName: "Director" } }),
            instance.get("/genres/"),
          ]);
        const allActors = actorsResponse.data.result || [];
        const allDirectors = directorsResponse.data.result || [];
        const allGenres = genreResponse.data.result || [];

        // Lọc dữ liệu
        const formActorsId = formData.actorsId.map((actor) => actor.id);
        const formDirectorId = formData.directorId?.id || null;
        const formGenresId = formData.genresId.map((genre) => genre.id);

        const newActors = allActors.filter(
          (actor) => !formActorsId.includes(actor.id)
        );
        const newDirectors = allDirectors.filter(
          (director) => director.id !== formDirectorId
        );
        const newGenres = allGenres.filter(
          (genre) => !formGenresId.includes(genre.id)
        );

        setActors(newActors);
        setDirectors(newDirectors);
        setGenres(newGenres);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (isFormDataReady) {
      fetchData();
    }
  }, [isFormDataReady]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleActorSelect = (actorId) => {
    const selectedActor = actors.find((actor) => actor.id === actorId);
    if (selectedActor) {
      setFormData((prev) => ({
        ...prev,
        actorsId: [...prev.actorsId, selectedActor],
      }));
      setActors((prev) => prev.filter((actor) => actor.id !== actorId));
    }
  };

  const handleActorRemove = (actorId) => {
    const removedActor = formData.actorsId.find(
      (actor) => actor.id === actorId
    );
    if (removedActor) {
      setFormData((prev) => ({
        ...prev,
        actorsId: prev.actorsId.filter((actor) => actor.id !== actorId),
      }));
      setActors((prev) => [...prev, removedActor]);
    }
  };

  const handleGenreSelect = (genreId) => {
    const selectedGenre = genres.find((genre) => genre.id === genreId);
    if (selectedGenre) {
      setFormData((prev) => ({
        ...prev,
        genresId: [...prev.genresId, selectedGenre],
      }));
      setGenres((prev) => prev.filter((genre) => genre.id !== genreId));
    }
  };

  const handleGenreRemove = (genreId) => {
    const removedGenre = formData.genresId.find(
      (genre) => genre.id === genreId
    );
    if (removedGenre) {
      setFormData((prev) => ({
        ...prev,
        genresId: prev.genresId.filter((genre) => genre.id !== genreId),
      }));
      setGenres((prev) => [...prev, removedGenre]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      genresId: formData.genresId.map((genre) => genre.id),
      actorsId: formData.actorsId.map((actor) => actor.id),
    };

    const data = new FormData();
    data.append(
      id ? "updateMovieRequest" : "createMovieRequest",
      new Blob([JSON.stringify(formattedData)], { type: "application/json" })
    );
    if (image) {
      data.append("file", image);
    }

    try {
      const response = id
        ? await instance.put(`/movies/${id}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await instance.post("/movies/", data, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      if (response.data.code === 200) {
        setModalData({
          title: id ? "Edit Movie" : "Add Movie",
          detail: response.data.message,
        });
        setIsModalOpen(true);
      }
      console.log("Movie submitted:", response.data);
    } catch (error) {
      console.error("Error submitting movie:", error);
      alert("Failed to submit movie.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  console.log(formData);
  return (
    <div className="max-w-6xl mx-auto p-4 rounded shadow-lg bg-gradient-to-r from-slate-400 via-indigo-500 to-indigo-700 h-full">
      <h2 className="text-md font-bold text-white mb-3 text-center">
        {id ? "Edit Movie" : "Add Movie"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-x-6 gap-y-2 bg-white p-6 rounded shadow-md h-full overflow-y-auto"
      >
        {/* Các trường nhập liệu */}
        {[
          { label: "Name", type: "text", name: "name" },
          { label: "Premiere Day", type: "date", name: "premiere" },
          { label: "Language", type: "text", name: "language" },
          {
            label: "Duration (minutes)",
            type: "number",
            name: "duration",
            min: "60",
          },
          { label: "Rate", type: "number", name: "rate", step: "0.1" },
        ].map(({ label, ...inputProps }) => (
          <div key={inputProps.name} className="col-span-1">
            <label className="block text-md font-semibold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700">
              {label}
            </label>
            <input
              {...inputProps}
              value={formData[inputProps.name]}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border-2 border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
              required
            />
          </div>
        ))}
        {/* Combobox Genres */}
        <div className="col-span-1">
          <label className="block text-md font-semibold">Genres</label>
          <select
            onChange={(e) => {
              const selectedValue = e.target.value;
              if (selectedValue) handleGenreSelect(selectedValue);
            }}
            className="mt-1 block w-full p-3 border-2 border-gray-300 rounded-md shadow-sm"
            value="" // Reset lại select sau mỗi lần chọn
          >
            <option value="" disabled>
              {genres.length > 0 ? "Select Genre" : "No Genre Available"}
            </option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>

          {/* Hiển thị danh sách các Genres đã chọn */}
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-700">
              Selected Genre:
            </p>
            <ul className="mt-2 space-y-1">
              {(formData.genresId || []).map((genre) => (
                <li
                  key={genre.id}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded-md shadow-sm"
                >
                  <span>{genre.name}</span>
                  <button
                    onClick={() => handleGenreRemove(genre.id)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Combobox Director */}
        <div className="col-span-1">
          <label className="block text-md font-semibold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700">
            Director
          </label>
          <select
            name="directorId"
            value={formData.directorId}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border-2 border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
            required
          >
            <option value="">Select Director</option>
            {directors.map((director) => (
              <option key={director.id} value={director.id}>
                {director.name}
              </option>
            ))}
          </select>
        </div>

        {/* Combobox Actors */}
        <div className="col-span-1">
          <label className="block text-md font-semibold">Actors</label>
          <select
            onChange={(e) => {
              const selectedValue = e.target.value;
              if (selectedValue) handleActorSelect(selectedValue);
            }}
            className="mt-1 block w-full p-3 border-2 border-gray-300 rounded-md shadow-sm"
            value="" // Reset lại select sau mỗi lần chọn
          >
            <option value="" disabled>
              {actors.length > 0 ? "Select Actor" : "No Actor Available"}
            </option>
            {actors.map((actor) => (
              <option key={actor.id} value={actor.id}>
                {actor.name}
              </option>
            ))}
          </select>

          {/* Hiển thị danh sách các Actors đã chọn */}
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-700">
              Selected Actors:
            </p>
            <ul className="mt-2 space-y-1">
              {(formData.actorsId || []).map((actor) => (
                <li
                  key={actor.id}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded-md shadow-sm"
                >
                  <span>{actor.name}</span>
                  <button
                    onClick={() => handleActorRemove(actor.id)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Tải lên ảnh */}
        <div className="col-span-2">
          <label className="block text-lg font-semibold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full p-3 border-2 border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
            required
          />
          {preview && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-600">
                Image Preview:
              </p>
              <img
                src={preview}
                alt="Preview"
                className="mt-2 w-full max-w-xs h-auto rounded shadow"
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="col-span-2">
          <label className="block text-lg font-semibold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700">
            Content
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border-2 border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
            rows="3"
            required
          ></textarea>
        </div>

        {/* Nút Submit */}
        <div className="col-span-2">
          <button
            type="submit"
            className="w-full py-3 px-6 bg-gradient-to-r from-slate-400 via-indigo-500 to-indigo-700 text-white font-semibold text-lg rounded-md shadow hover:shadow-lg transform hover:scale-105 transition duration-300"
          >
            Add Movie
          </button>
        </div>
      </form>
      {isModalOpen && (
        <SuccessModal title={modalData.title} detail={modalData.detail} />
      )}
    </div>
  );
};

export default MovieForm;
