import React, { useState, useEffect } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import {
  FaBell, FaArrowUp, FaArrowDown, FaComment, FaTag,
  FaClock, FaStar, FaPenFancy, FaSearch, FaTimes
} from "react-icons/fa";
import { MdForum } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";
import Testimonials from "./Testimonials";
import WhyChooseUs from "./WhyChooseUs";
import CountUpStats from "./CountUpStats";
import EarnBadges from "./EarnBadges";

const Home = () => {
  const axiosSecure = useAxiosSecure();

  // States
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const [postSearchQuery, setPostSearchQuery] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  // Initialize AOS
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // ===== Fetch Posts and Tags =====
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const postsRes = await axiosSecure.get("/posts");
        setPosts(postsRes.data);

        const tagsRes = await axiosSecure.get("/tags");
        setTags(tagsRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        setLoading(false);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const res = await axiosSecure.get("/announcements");
        setAnnouncements(res.data);
      } catch (err) {
        console.error("Fetch Announcements Error:", err);
      }
    };

    fetchData();
    fetchAnnouncements();
  }, [axiosSecure]);

  // ===== Search Tags =====
  const searchTags = async (query) => {
    if (!query.trim()) {
      setTagSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const res = await axiosSecure.get(`/tags/search?q=${encodeURIComponent(query)}`);
      setTagSuggestions(res.data);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Tag search error:", err);
      setTagSuggestions([]);
    }
  };

 
  const fetchPostsByTag = async (tagName) => {
    try {
      setSearchLoading(true);
      const res = await axiosSecure.get(`/posts/by-tag/${encodeURIComponent(tagName)}`);
      setPosts(res.data);
      setSearchLoading(false);
    } catch (err) {
      console.error("Fetch posts by tag error:", err);
      setSearchLoading(false);
    }
  };

  // ===== Search Posts by Keyword =====
  const searchPostsByKeyword = async () => {
    if (!postSearchQuery.trim()) {
      fetchAllPosts();
      return;
    }

    try {
      setSearchLoading(true);
      const res = await axiosSecure.get(`/posts/search?keyword=${encodeURIComponent(postSearchQuery)}`);
      setPosts(res.data);
      setSelectedTag(""); 
      setCurrentPage(1);
      setSearchLoading(false);
    } catch (err) {
      console.error("Search posts error:", err);
      const filtered = posts.filter(post =>
        post.title?.toLowerCase().includes(postSearchQuery.toLowerCase()) ||
        post.description?.toLowerCase().includes(postSearchQuery.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(postSearchQuery.toLowerCase()))
      );
      setPosts(filtered);
      setSelectedTag("");
      setCurrentPage(1);
      setSearchLoading(false);
    }
  };

  const handlePostSearch = () => {
    searchPostsByKeyword();
  };

  const handlePostSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      searchPostsByKeyword();
    }
  };

  const fetchAllPosts = async () => {
    try {
      setSearchLoading(true);
      const res = await axiosSecure.get("/posts");
      setPosts(res.data);
      setSearchLoading(false);
    } catch (err) {
      console.error("Fetch all posts error:", err);
      setSearchLoading(false);
    }
  };

  const handleTagSelect = (tagName) => {
    if (tagName === selectedTag) {
      setSelectedTag("");
      setPostSearchQuery("");
      fetchAllPosts();
    } else {
      setSelectedTag(tagName);
      setPostSearchQuery("");
      fetchPostsByTag(tagName);
    }
    setCurrentPage(1);
  };

  const handleAllTags = () => {
    setSelectedTag("");
    setTagSearchQuery("");
    setPostSearchQuery("");
    setTagSuggestions([]);
    setShowSuggestions(false);
    fetchAllPosts();
    setCurrentPage(1);
  };



  const clearPostSearch = () => {
    setPostSearchQuery("");
    fetchAllPosts();
  };

  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags?.includes(selectedTag))
    : posts;

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const sortByPopularity = () => {
    const sorted = [...posts].sort(
      (a, b) => (b.upVote - b.downVote) - (a.upVote - a.downVote)
    );
    setPosts(sorted);
  };

  return (
    <div className="mt-15 container mx-auto px-4 pt-6 ">

      {/* ===== Banner ===== */}
      <div
        className="relative rounded-xl shadow-2xl mb-10 p-8 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
      >
        <div className="lg:w-2/3 mx-auto text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
            <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg flex items-center gap-3">
              Welcome to{" "}
              <span className="flex items-center gap-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-purple-100 to-pink-200">
                  ForumX
                </span>
                <div className="ml-3 bg-gradient-to-r from-indigo-600 to-indigo-400 p-3 rounded-lg shadow-lg animate-bounce">
                  <MdForum className="w-8 h-8 text-white" />
                </div>
              </span>
            </h1>
          </div>

          <p className="text-lg md:text-xl mb-6 drop-shadow-md">
            Explore posts, share your thoughts & discover trending topics!
          </p>

          {/* Post Search Bar */}
          <div className="relative mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search posts by title, description, or content..."
                  value={postSearchQuery}
                  onChange={(e) => setPostSearchQuery(e.target.value)}
                  onKeyPress={handlePostSearchKeyPress}
                  className="w-full pl-12 pr-10 py-3 rounded-lg border border-white bg-white/30 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" />
                {postSearchQuery && (
                  <button
                    onClick={clearPostSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              <button
                onClick={handlePostSearch}
                disabled={searchLoading}
                className="bg-white text-indigo-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition font-medium disabled:opacity-50 flex items-center gap-2"
              >
                <FaSearch />
                Search
              </button>
            </div>
          </div>

          {/* All Tags */}
          <div className="flex flex-col items-center lg:items-start">
            <button
              onClick={handleAllTags}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition mb-3
                ${!selectedTag && !postSearchQuery
                  ? "bg-white text-indigo-600 shadow-lg"
                  : "bg-white/30 text-white hover:bg-white/50"
                }`}
            >
              <FaTag />
              All Tags
            </button>

            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {tags.length > 0 ? (
                tags.map((tag, idx) => (
                  <button
                    key={tag._id}
                    onClick={() => handleTagSelect(tag.name)}
                    data-aos="fade-up"
                    data-aos-delay={idx * 50}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition
                      ${selectedTag === tag.name
                        ? "bg-white text-indigo-600 shadow-lg"
                        : "bg-white/30 text-white hover:bg-white/50"
                      }`}
                  >
                    <FaTag /> {tag.name}
                  </button>
                ))
              ) : (
                <p className="text-white/70 text-sm">No tags available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 my-10 ">
        <div className="text-gray-600 ">
          <p className="text-base ">
            Showing <span className="font-semibold text-indigo-600">{currentPosts.length}</span> of{" "}
            <span className="font-semibold text-indigo-600">{filteredPosts.length}</span> posts
            {selectedTag && (
              <span className="text-indigo-600 ml-2">
                (filtered by tag: <span className="font-semibold">"{selectedTag}"</span>)
              </span>
            )}
            {postSearchQuery && !selectedTag && (
              <span className="text-indigo-600 ml-2">
                (search results for: <span className="font-semibold">"{postSearchQuery}"</span>)
              </span>
            )}
          </p>
        </div>

        <button
          onClick={sortByPopularity}
          className="btn btn-outline btn-indigo flex items-center gap-2"
        >
          <FaStar /> Sort by Popularity
        </button>
      </div>

      {/* Posts Grid */}
      {loading || searchLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="text-indigo-600 mt-2">
            {searchLoading ? "Searching posts..." : "Loading posts..."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {currentPosts.length > 0 ? (
            currentPosts.map((post, idx) => (
              <div
                key={post._id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition"
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-2">
                    <img
                      src={post.authorImage || "/default-avatar.png"}
                      alt="Author"
                      className="w-12 h-12 rounded-full border-2 border-indigo-400"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{post.authorName || "Anonymous"}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FaClock className="text-indigo-500" /> {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <h2 className="card-title flex items-center gap-2">
                    <FaPenFancy /> {post.title}
                  </h2>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {post.tags?.map((tag, i) => (
                      <span
                        key={i}
                        className={`badge flex items-center gap-1 cursor-pointer transition ${
                          tag === selectedTag ? "badge-primary text-white" : "badge-outline badge-primary hover:bg-indigo-50"
                        }`}
                        onClick={() => handleTagSelect(tag)}
                      >
                        <FaTag /> {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 mt-4 text-gray-600">
                    <span className="flex items-center gap-1">
                      <FaArrowUp className="text-green-600" /> {post.upVote || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaArrowDown className="text-red-600" /> {post.downVote || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaComment className="text-blue-600" /> {post.commentCount || 0}
                    </span>
                  </div>

                  <div className="card-actions justify-end mt-4">
                    <a
                      href={`/post/${post._id}`}
                      className="btn btn-sm text-white transition-shadow shadow-md bg-gradient-to-r from-indigo-600 to-indigo-400 hover:opacity-90 flex items-center gap-1"
                    >
                      <FaPenFancy /> Read More
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                {selectedTag
                  ? `No posts found with tag "${selectedTag}"`
                  : postSearchQuery
                  ? `No posts found for "${postSearchQuery}"`
                  : "No posts found"}
              </p>
              {(selectedTag || postSearchQuery) && (
                <div className="grid place-items-center">
                  <button
                    onClick={handleAllTags}
                    className="btn btn-primary flex items-center gap-1"
                  >
                    <FaTag /> View All Posts
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="btn btn-sm btn-outline disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`btn btn-sm ${currentPage === i + 1 ? "btn-primary" : "btn-outline"}`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="btn btn-sm btn-outline disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Announcements */}
      {announcements.length > 0 && (
        <section id="notifications"  className="scroll-mt-16 mt-20 p-10 flex flex-col items-center shadow-md bg-gray-50">
          <div className="flex items-center mb-8 justify-center">
            <FaBell className="text-3xl text-indigo-600 mr-2" />
            <h2 className="text-3xl font-bold text-gray-800 text-center">Announcements</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
            {announcements.map((ann, idx) => (
              <div
                key={ann._id}
                className="relative bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500 hover:shadow-2xl transition transform hover:-translate-y-2 w-full md:w-80"
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <div className="animate-pulse absolute -top-3 -left-3 bg-indigo-500 rounded-full p-3 shadow-lg text-white">
                  <FaBell />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4 text-center">{ann.title}</h3>
                <p className="text-gray-600 mb-4 text-center">{ann.description}</p>
                <p className="text-sm text-gray-400 flex items-center gap-2 justify-center">
                  <FaClock className="text-indigo-400" /> {new Date(ann.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Other Sections */}
 <section >
       <CountUpStats />
 </section>
      <WhyChooseUs />
      <EarnBadges />
      <Testimonials />
    </div>
  );
};

export default Home;
