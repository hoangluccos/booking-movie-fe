import { Button, ConfigProvider, Popconfirm, Popover } from "antd";
import { useEffect, useState } from "react";
import {
  FaFilter,
  FaAngleDown,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../../redux/Store/Store.tsx";
import { toast } from "react-toastify";
import {
  deleteFeedback,
  getAllFeedbacks,
} from "../../../redux/Slices/FeedbackSlice.tsx";
import { getDetailMovie } from "../../../redux/Slices/MovieSlice.tsx";
import { FaRegTrashCan } from "react-icons/fa6";

const FeedbackPage = () => {
  const dispatch = useAppDispatch();
  const { listFeedbacks } = useAppSelector((state) => state.feedback);

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({ movie: [] });
  const [tempFilters, setTempFilters] = useState<Filters>({ movie: [] });
  const [moviePopoverOpen, setMoviePopoverOpen] = useState(false);
  const [enrichedFeedbacks, setEnrichedFeedbacks] = useState<FeedbackType[]>(
    []
  );
  const [movieCache, setMovieCache] = useState<Map<string, MovieType>>(
    new Map()
  );

  // Define movie type (only fields needed for display)
  interface MovieType {
    id: string;
    name: string;
    image: string;
  }

  // Define enriched feedback type for display
  interface FeedbackType {
    id: string;
    content: string;
    rate: number;
    date: string;
    time: string;
    byName: string;
    byEmail: string;
    movie: MovieType;
    status: boolean;
  }

  // Define filter interface
  interface Filters {
    movie: string[];
  }

  const feedbacksPerPage = 13;

  // Fetch feedbacks on mount
  useEffect(() => {
    dispatch(getAllFeedbacks());
  }, [dispatch]);

  // Enrich feedbacks with movie details
  useEffect(() => {
    const enrichFeedbacks = async () => {
      const newMovieCache = new Map(movieCache);
      const enriched: FeedbackType[] = [];

      for (const feedback of listFeedbacks) {
        // Validate movieId
        if (!feedback.movieId || typeof feedback.movieId !== "string") {
          console.warn(
            `Invalid or missing movieId for feedback ${feedback.id}`
          );
          toast.error(`Invalid movie data for feedback ${feedback.id}`);
          continue;
        }

        let movie: MovieType | undefined = newMovieCache.get(feedback.movieId);

        // Fetch movie if not in cache
        if (!movie) {
          try {
            const movieData = await dispatch(
              getDetailMovie({ movieId: feedback.movieId })
            ).unwrap();
            if (movieData) {
              movie = {
                id: movieData.id,
                name: movieData.name,
                image: movieData.image || "https://via.placeholder.com/150", // Fallback image
              };
              newMovieCache.set(feedback.movieId, movie);
            } else {
              console.warn(`Movie ${feedback.movieId} not found`);
              toast.error(`Movie ${feedback.movieId} not found`);
              continue;
            }
          } catch (error) {
            console.error(`Failed to fetch movie ${feedback.movieId}`, error);
            toast.error(`Failed to fetch movie ${feedback.movieId}`);
            continue;
          }
        }

        // Include feedback with movie data
        enriched.push({
          ...feedback,
          movie,
        });
      }

      setMovieCache(newMovieCache);
      setEnrichedFeedbacks(enriched);
    };

    if (listFeedbacks.length > 0) {
      enrichFeedbacks();
    }
  }, [listFeedbacks, dispatch]);

  // Dynamic movie options for filter
  const movieOptions = Array.from(
    new Set(enrichedFeedbacks.map((item) => item.movie.name))
  ).map((name) => ({
    label: name,
    value: name,
  }));

  // Filter logic
  const filteredFeedbacks = enrichedFeedbacks.filter(
    (item) => !filters.movie.length || filters.movie.includes(item.movie.name)
  );

  const totalItems = filteredFeedbacks.length;
  const totalPages = Math.ceil(totalItems / feedbacksPerPage);
  const startIndex = (currentPage - 1) * feedbacksPerPage;
  const endIndex = startIndex + feedbacksPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(startIndex, endIndex);

  const applyFilters = () => {
    setFilters(tempFilters);
    setCurrentPage(1);
    setMoviePopoverOpen(false);
  };

  const resetFilters = () => {
    setFilters({ movie: [] });
    setTempFilters({ movie: [] });
    setCurrentPage(1);
  };

  const showFeedback = (
    item: FeedbackType,
    isLastRow: boolean,
    onDelete: (item: FeedbackType) => void
  ) => (
    <div
      className={`grid grid-cols-6 bg-[#273142] text-white ${
        isLastRow ? "rounded-b-xl" : "border-b border-[#979797]"
      }`}
    >
      <div className="flex justify-center items-center p-2 font-saira">
        <div className="truncate max-w-[150px]">{item.movie.name}</div>
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {item.byName}
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {item.content}
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {item.rate}
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {item.date} {item.time.slice(0, 5)}
      </div>
      <div className="flex justify-center items-center">
        <Popconfirm
          title={
            <span className="font-saira text-sm text-white">
              Are you sure to delete this comment?
            </span>
          }
          description={
            <div className="flex flex-col">
              <span className="font-saira text-sm text-white">{`Content: "${item.content}"`}</span>
              <span className="font-saira text-sm text-white">{`By: "${item.byName}"`}</span>
            </div>
          }
          onConfirm={() => onDelete(item)}
          okText={<span className="font-saira">Yes</span>}
          cancelText={<span className="font-saira">No</span>}
          okType="danger"
        >
          <button className="bg-[#323D4E] h-[32px] px-4 py-2 rounded-lg">
            <FaRegTrashCan color="red" />
          </button>
        </Popconfirm>
      </div>
    </div>
  );

  const SelectablePopover = (
    options: { label: string; value: string }[],
    selected: string[],
    setSelected: (value: string[]) => void,
    setOpen: (val: boolean) => void
  ) => (
    <div className="w-[400px] p-4 bg-[#273142] rounded-lg text-white font-saira">
      <div className="mb-4 text-lg">Select Movie</div>
      <div className="grid grid-cols-3 gap-2">
        {options.map((item) => {
          const isSelected = selected.includes(item.value);
          return (
            <div
              key={item.value}
              className={`px-2 py-1 justify-center items-center flex text-center cursor-pointer border rounded text-sm ${
                isSelected
                  ? "bg-[#4880FF] text-white border-[#4880FF]"
                  : "bg-transparent text-white border-gray-400"
              }`}
              onClick={() => {
                setSelected(
                  isSelected
                    ? selected.filter((val) => val !== item.value)
                    : [...selected, item.value]
                );
              }}
            >
              {item.label}
            </div>
          );
        })}
      </div>
      <div className="text-xs text-gray-400 mt-3 italic">
        *You can choose multiple MOVIES
      </div>
      <div className="flex justify-center items-center">
        <Button
          type="primary"
          className="mt-4 w-[129px] h-[36px] text-sm"
          onClick={applyFilters}
        >
          Apply Now
        </Button>
      </div>
    </div>
  );

  const handleClickDeleteFeedback = (item: FeedbackType) => {
    dispatch(deleteFeedback({ feedbackId: item.id }));
    toast.success("Feedback deleted successfully!");
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: '"Saira Semi Condensed", sans-serif',
        },
        components: {
          Popover: {
            colorBgElevated: "#323D4E",
            colorText: "#FFFFFF",
            borderRadius: 8,
          },
          Popconfirm: {
            colorBgElevated: "#ffffff",
            colorText: "#000000",
            colorPrimary: "#ff4d4f",
            borderRadius: 8,
          },
          Button: {
            colorText: "#FFFFFF",
            colorBgContainer: "#323D4E",
            colorBorder: "transparent",
            borderRadius: 8,
          },
        },
      }}
    >
      <div className="min-h-[750px]">
        {/* Title */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-white text-3xl font-saira">Feedbacks</span>
        </div>

        {/* Filter Section */}
        <div className="flex items-center gap-4 mb-6 text-white font-saira text-sm">
          <FaFilter size={25} />
          <span className="font-saira">Filter By</span>

          {/* Movie Name Popover */}
          <Popover
            title={null}
            trigger="click"
            open={moviePopoverOpen}
            onOpenChange={(open) => setMoviePopoverOpen(open)}
            content={SelectablePopover(
              movieOptions,
              tempFilters.movie,
              (val) => setTempFilters((prev) => ({ ...prev, movie: val })),
              setMoviePopoverOpen
            )}
            placement="bottomLeft"
          >
            <Button
              className="w-[180px] h-[48px] rounded-md font-saira flex items-center justify-between px-3 bg-[#323D4E] text-white"
              style={{ border: "transparent" }}
            >
              {filters.movie.length > 0
                ? `${filters.movie.length} Movies`
                : "Movie"}
              <FaAngleDown />
            </Button>
          </Popover>

          {/* Reset Filter Button */}
          <Button
            onClick={resetFilters}
            className="w-[147px] h-[48px] rounded-md font-saira flex items-center px-3 bg-[#323D4E] text-white focus:outline-none active:outline-none"
          >
            <span className="text-xl">↺</span>
            <span>Reset Filter</span>
          </Button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-6">
          {["Movie", "By user", "Content", "Rate", "Date & Time", "Action"].map(
            (title, idx) => (
              <div
                key={idx}
                className={`bg-[#313D4F] font-saira text-white h-[48px] flex justify-center items-center p-4 w-full ${
                  idx === 0 ? "rounded-tl-xl" : ""
                } ${idx === 5 ? "rounded-tr-xl" : ""}`}
              >
                {title}
              </div>
            )
          )}
        </div>

        {/* Table Body */}
        <div className="min-h-[548px]">
          {currentFeedbacks.length > 0 ? (
            currentFeedbacks.map((item, index) => (
              <div key={item.id}>
                {showFeedback(
                  item,
                  index === currentFeedbacks.length - 1,
                  handleClickDeleteFeedback
                )}
              </div>
            ))
          ) : (
            <div className="text-white text-center py-4">
              No feedbacks found
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center pt-4 space-x-4">
          <span className="text-white font-saira">
            Showing {Math.min(startIndex + 1, totalItems)}-
            {Math.min(endIndex, totalItems)} of {totalItems}
          </span>
          <div className="flex">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`bg-[#323D4E] h-[32px] px-4 py-2 rounded-l-lg border-r border-[#979797] ${
                currentPage === 1 ? "opacity-50" : ""
              }`}
              disabled={currentPage === 1}
            >
              <FaAngleLeft color="white" />
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className={`bg-[#323D4E] h-[32px] px-4 py-2 rounded-r-lg ${
                currentPage === totalPages ? "opacity-50" : ""
              }`}
              disabled={currentPage === totalPages}
            >
              <FaAngleRight color="white" />
            </button>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default FeedbackPage;
