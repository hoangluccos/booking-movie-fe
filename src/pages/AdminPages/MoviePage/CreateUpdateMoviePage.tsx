// CreateMoviePage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Select, ConfigProvider, DatePicker, Input, Button } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store.tsx";
import {
  createMovie,
  getDetailMovie,
  updateMovie,
} from "../../../redux/slices/MovieSlice.tsx";
import { getAllGenres } from "../../../redux/slices/GenreSlice.tsx";
import {
  getAllActors,
  getAllDirectors,
} from "../../../redux/slices/PersonSlice.tsx";

const { TextArea } = Input;

const CreateUpdateMoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, movieDetail } = useAppSelector(
    (state) => state.movie
  );
  const { listGenre } = useAppSelector((state) => state.genre);

  const [movie, setMovie] = useState({
    name: "",
    content: "",
    premiere: null as Dayjs | null,
    duration: "",
    language: "",
    rate: "",
    image: null as File | null,
    director: "",
    genresId: [] as string[],
    actorsId: [] as string[],
    existingImageUrl: "" as string,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [actors, setActors] = useState<{ id: string; name: string }[]>([]);
  const [directors, setDirectors] = useState<{ id: string; name: string }[]>(
    []
  );
  const [genres, setGenres] = useState<{ id: string; name: string }[]>([]);
  const [isFormDataReady, setIsFormDataReady] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getDetailMovie({ movieId: id }));
    } else {
      setIsFormDataReady(true);
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (movieDetail) {
      setMovie({
        name: movieDetail.name,
        content: movieDetail.content,
        premiere: movieDetail.premiere
          ? dayjs(movieDetail.premiere, "DD-MM-YYYY")
          : null,
        duration: movieDetail.duration.toString(),
        language: movieDetail.language,
        rate: movieDetail.rate.toString(),
        image: null,
        director: movieDetail.director.id,
        genresId: movieDetail.genres.map((g) => g.id),
        actorsId: movieDetail.actors.map((a) => a.id),
        existingImageUrl: movieDetail.image || "",
      });
      setPreview(movieDetail.image);
      setIsFormDataReady(true);
    }
  }, [movieDetail]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [actorsData, directorsData, genresData] = await Promise.all([
          dispatch(getAllActors()).unwrap(),
          dispatch(getAllDirectors()).unwrap(),
          dispatch(getAllGenres()).unwrap(),
        ]);

        setActors(actorsData || []);
        setDirectors(directorsData || []);
        setGenres(genresData || []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        toast.error("Failed to fetch dropdown data.");
      }
    };

    if (isFormDataReady) {
      fetchData();
    }
  }, [isFormDataReady, dispatch]);

  const handleChange = (name: string, value: string | File | null) => {
    setMovie((prev) => ({
      ...prev,
      [name]:
        name === "rate" || name === "duration"
          ? Math.max(1, Number(value) || 1).toString()
          : value,
    }));
  };

  const handleDateChange = (date: Dayjs | null) => {
    setMovie((prev) => ({ ...prev, premiere: date }));
  };

  const handleSelectChange = (value: string[], name: string) => {
    setMovie((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setMovie((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const premiereDate = movie.premiere
      ? movie.premiere.format("YYYY-MM-DD")
      : null;

    if (!premiereDate) {
      toast.error("Please select a premiere date.");
      return;
    }

    const movieData = {
      name: movie.name,
      content: movie.content,
      premiere: premiereDate,
      duration: parseInt(movie.duration) || 60,
      language: movie.language,
      rate: parseFloat(movie.rate) || 1,
      genresId: movie.genresId,
      directorId: movie.director,
      actorsId: movie.actorsId,
    };

    try {
      console.log("Request params: ", movieData);
      console.log("Image: ", movie.existingImageUrl);
      if (id) {
        // Nếu có id, gọi Redux API cập nhật phim
        await dispatch(
          updateMovie({
            movieId: id,
            movieData,
            image: movie.image || movie.existingImageUrl, // Đảm bảo image không undefined
          })
        ).unwrap();
        toast.success("Movie updated successfully!");
        setTimeout(() => navigate("/admin/movies"), 1000);
      } else {
        // Nếu không có id, gọi Redux API tạo mới
        await dispatch(createMovie({ movieData, image: movie.image })).unwrap();
        toast.success("Movie created successfully!");
        setTimeout(() => navigate("/admin/movies"), 1000);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create or update movie.");
      console.log("Error: ", error);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: '"Saira Semi Condensed", sans-serif',
        },
        components: {
          Select: {
            controlHeight: 48,
            colorBgContainer: "#323D4E",
            colorText: "white",
            colorBorder: "transparent",
            borderRadius: 8,
            colorTextPlaceholder: "rgba(255, 255, 255, 0.5)",
            optionSelectedBg: "#1e2632",
            selectorBg: "#323D4E",
            colorBgElevated: "#323D4E",
          },
          Input: {
            controlHeight: 48,
            colorBgContainer: "#323D4E",
            colorText: "white",
            colorBorder: "transparent",
            borderRadius: 8,
            colorTextPlaceholder: "rgba(255, 255, 255, 0.5)",
          },
          DatePicker: {
            controlHeight: 48,
            colorBgContainer: "#323D4E",
            colorText: "white",
            colorBorder: "transparent",
            borderRadius: 8,
            colorTextPlaceholder: "rgba(255, 255, 255, 0.5)",
            colorBgElevated: "#323D4E",
          },
        },
      }}
    >
      <div className="text-white">
        <ToastContainer />
        <span className="text-3xl mb-8 flex font-saira">
          {id ? "Edit Movie" : "Add New Movie"}
        </span>
        <div className="w-full bg-[#273142] p-10 rounded-2xl shadow-lg max-h-[700px] overflow-y-scroll scrollbar-hidden">
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            {/* Upload Poster */}
            <div className="mb-8 flex flex-col items-center">
              <label className="text-white mb-2 block text-lg font-saira">
                Poster
              </label>
              <div className="relative w-[200px] h-[300px] bg-[#323D4E] rounded-xl flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-center text-sm px-4 font-saira">
                    No image selected
                  </span>
                )}
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Button
                  type="primary"
                  size="small"
                  onClick={() => document.getElementById("image")?.click()}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 font-saira !bg-blue-500 hover:!bg-blue-600 !text-white !text-sm !px-2 !py-1 !rounded-md"
                >
                  Select image
                </Button>
                {preview && (
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setMovie((prev) => ({ ...prev, image: null }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 flex items-center justify-center rounded-full"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Movie Info */}
            <div className="grid grid-cols-2 gap-6 w-full">
              <div className="flex flex-col">
                <label className="mb-2 font-saira">Movie Name</label>
                <Input
                  name="name"
                  placeholder="Enter movie name"
                  value={movie.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-saira">Premiere Date</label>
                <DatePicker
                  value={movie.premiere}
                  onChange={handleDateChange}
                  format="DD-MM-YYYY"
                  placeholder="Select premiere date"
                  style={{ width: "100%" }}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-saira">Duration (minutes)</label>
                <Input
                  type="number"
                  name="duration"
                  placeholder="Enter duration"
                  value={movie.duration}
                  onChange={(e) => handleChange("duration", e.target.value)}
                  min="60"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-saira">Rate</label>
                <Input
                  type="number"
                  name="rate"
                  placeholder="Enter rate"
                  value={movie.rate}
                  onChange={(e) => handleChange("rate", e.target.value)}
                  step="0.1"
                  min="1"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-saira">Language</label>
                <Input
                  name="language"
                  placeholder="Enter language"
                  value={movie.language}
                  onChange={(e) => handleChange("language", e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-saira">Director</label>
                <Select
                  placeholder="Select director"
                  value={movie.director || undefined}
                  onChange={(value: string) => handleChange("director", value)}
                  style={{ width: "100%" }}
                >
                  {directors.map((director) => (
                    <Select.Option key={director.id} value={director.id}>
                      {director.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-saira">Genres</label>
                <Select
                  mode="multiple"
                  placeholder="Select genres"
                  value={movie.genresId}
                  onChange={(value: string[]) =>
                    handleSelectChange(value, "genresId")
                  }
                  style={{ width: "100%" }}
                >
                  {genres.map((genre) => (
                    <Select.Option key={genre.id} value={genre.id}>
                      {genre.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-saira">Actors</label>
                <Select
                  mode="multiple"
                  placeholder="Select actors"
                  value={movie.actorsId}
                  onChange={(value: string[]) =>
                    handleSelectChange(value, "actorsId")
                  }
                  style={{ width: "100%" }}
                >
                  {actors.map((actor) => (
                    <Select.Option key={actor.id} value={actor.id}>
                      {actor.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div className="col-span-2 flex flex-col">
                <label className="mb-2 font-saira">Content</label>
                <TextArea
                  name="content"
                  placeholder="Enter movie content"
                  value={movie.content}
                  onChange={(e) => handleChange("content", e.target.value)}
                  rows={4}
                  style={{ resize: "none" }}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="primary"
              htmlType="submit"
              className="mt-8 h-[56px] w-[274px]"
              style={{
                backgroundColor: "#3b82f6",
                borderColor: "#3b82f6",
                padding: "8px 48px",
                borderRadius: "8px",
                transition:
                  "background-color 0.3s ease, border-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#2563eb";
                e.currentTarget.style.borderColor = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#3b82f6";
                e.currentTarget.style.borderColor = "#3b82f6";
              }}
              loading={isLoading}
            >
              {id ? "Update Movie" : "Add Now"}
            </Button>
          </form>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default CreateUpdateMoviePage;
