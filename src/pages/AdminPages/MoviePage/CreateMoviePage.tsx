// CreateMoviePage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Select, ConfigProvider, DatePicker, Input, Button } from "antd";
import dayjs, { Dayjs } from "dayjs";
import instance from "../../../api/instance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CreateMovieRequest } from "../Data/Data.tsx";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store.tsx";
import { createMovie } from "../../../redux/slices/movieSlice.tsx";

const { TextArea } = Input;

const CreateMoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.movie);

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
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [actors, setActors] = useState<{ id: string; name: string }[]>([]);
  const [directors, setDirectors] = useState<{ id: string; name: string }[]>(
    []
  );
  const [genres, setGenres] = useState<{ id: string; name: string }[]>([]);
  const [isFormDataReady, setIsFormDataReady] = useState(false);

  const mapMovieDataToFormData = (apiResponse: any) => {
    const movie = apiResponse.result;
    return {
      name: movie.name,
      content: movie.content,
      premiere: movie.premiere ? dayjs(movie.premiere) : null,
      duration: movie.duration.toString(),
      language: movie.language,
      rate: movie.rate.toString(),
      image: movie.image,
      director: movie.director.id,
      genresId: movie.genres.map((g: any) => g.id),
      actorsId: movie.actors.map((a: any) => a.id),
    };
  };

  useEffect(() => {
    if (id) {
      const fetchMovieData = async () => {
        try {
          const res = await instance.get(`/movies/${id}`);
          if (res.data.code === 200) {
            const movieData = mapMovieDataToFormData(res.data);
            setMovie(movieData);
            setPreview(movieData.image);
            setIsFormDataReady(true);
          }
        } catch (error) {
          console.error("Error fetching movie data:", error);
          toast.error("Failed to fetch movie data.");
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
        setActors(actorsResponse.data.result || []);
        setDirectors(directorsResponse.data.result || []);
        setGenres(genreResponse.data.result || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch dropdown data.");
      }
    };

    if (isFormDataReady) {
      fetchData();
    }
  }, [isFormDataReady]);

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

    const movieData: CreateMovieRequest = {
      name: movie.name,
      content: movie.content,
      premiere: premiereDate,
      duration: parseInt(movie.duration) || 60,
      language: movie.language,
      rate: parseFloat(movie.rate) || 1,
      genresId: movie.genresId, // Use genresId directly
      directorId: movie.director,
      actorsId: movie.actorsId,
    };

    console.log("Request data: ", movieData);

    try {
      if (id) {
        // TODO: Implement updateMovie thunk if needed
        toast.error("Update functionality not implemented yet.");
      } else {
        await dispatch(createMovie({ movieData, image: movie.image })).unwrap();
        toast.success("Movie created successfully!");
        setTimeout(() => navigate("/admin/movies"), 1000);
      }
    } catch (error: any) {
      toast.error(error || "Failed to create movie.");
    }
  };

  return (
    <ConfigProvider
      theme={{
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
        <span className="text-3xl mb-8 flex">
          {id ? "Edit Movie" : "Add New Movie"}
        </span>
        <div className="w-full bg-[#273142] p-10 rounded-2xl shadow-lg max-h-[700px] overflow-y-scroll scrollbar-hidden">
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            {/* Upload Poster */}
            <div className="mb-8 flex flex-col items-center">
              <label className="text-white mb-2 block text-lg">Poster</label>
              <div className="relative w-[200px] h-[300px] bg-[#323D4E] rounded-xl flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-center text-sm px-4">
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
                <button
                  type="button"
                  onClick={() => document.getElementById("image")?.click()}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1 rounded-md"
                >
                  Chọn ảnh
                </button>
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
                <label className="mb-2">Movie Name</label>
                <Input
                  name="name"
                  placeholder="Enter movie name"
                  value={movie.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2">Premiere Date</label>
                <DatePicker
                  value={movie.premiere}
                  onChange={handleDateChange}
                  format="YYYY-MM-DD"
                  placeholder="Select premiere date"
                  style={{ width: "100%" }}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2">Duration (minutes)</label>
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
                <label className="mb-2">Rate</label>
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
                <label className="mb-2">Language</label>
                <Input
                  name="language"
                  placeholder="Enter language"
                  value={movie.language}
                  onChange={(e) => handleChange("language", e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2">Director</label>
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
                <label className="mb-2">Genres</label>
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
                <label className="mb-2">Actors</label>
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
                <label className="mb-2">Content</label>
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
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#2563eb")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#3b82f6")
              }
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

export default CreateMoviePage;
