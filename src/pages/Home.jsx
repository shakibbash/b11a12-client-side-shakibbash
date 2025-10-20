import React, { useState, useEffect } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import {
  FaBell, FaArrowUp, FaArrowDown, FaComment, FaTag,
  FaClock, FaStar, FaPenFancy, FaSearch, FaTimes,
  FaArrowRight, FaSun, FaMoon
} from "react-icons/fa";
import { MdForum } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";
import Testimonials from "./Testimonials";
import WhyChooseUs from "./WhyChooseUs";
import CountUpStats from "./CountUpStats";
import EarnBadges from "./EarnBadges";
import LatestPosts from "./LatestPosts";
import { Link } from "react-router";
import CTA1 from "./CTA1";
import HeroCarousel from "./HeroCarousel";
import Faq from "./Faq";
import { useTheme } from "../Hooks/useTheme";

const Home = () => {
  const axiosSecure = useAxiosSecure();
  const { isDarkMode } = useTheme(); 

  // ====== States ======
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [postSearchQuery, setPostSearchQuery] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // ===== Pagination =====
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;

  // ===== Initialize AOS =====
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // ===== Fetch Posts, Tags & Announcements =====
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsRes, tagsRes, announcementsRes] = await Promise.all([
          axiosSecure.get("/posts"),
          axiosSecure.get("/tags"),
          axiosSecure.get("/announcements")
        ]);
        setPosts(postsRes.data);
        setTags(tagsRes.data);
        setAnnouncements(announcementsRes.data);
      } catch (err) {
        console.error("Data Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [axiosSecure]);

  // ===== Fetch Helpers =====
  const fetchAllPosts = async () => {
    try {
      setSearchLoading(true);
      const res = await axiosSecure.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Fetch all posts error:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchPostsByTag = async (tagName) => {
    try {
      setSearchLoading(true);
      const res = await axiosSecure.get(`/posts/by-tag/${encodeURIComponent(tagName)}`);
      setPosts(res.data);
    } catch (err) {
      console.error("Fetch posts by tag error:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const searchPostsByKeyword = async () => {
    if (!postSearchQuery.trim()) return fetchAllPosts();
    try {
      setSearchLoading(true);
      const res = await axiosSecure.get(`/posts/search?keyword=${encodeURIComponent(postSearchQuery)}`);
      setPosts(res.data);
      setSelectedTag("");
    } catch (err) {
      console.error("Search posts error:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  // ===== Handlers =====
  const handleTagSelect = (tagName) => {
    if (tagName === selectedTag) {
      setSelectedTag("");
      fetchAllPosts();
    } else {
      setSelectedTag(tagName);
      fetchPostsByTag(tagName);
    }
    setCurrentPage(1);
  };

  const handleAllTags = () => {
    setSelectedTag("");
    setPostSearchQuery("");
    fetchAllPosts();
    setCurrentPage(1);
  };

  const clearPostSearch = () => {
    setPostSearchQuery("");
    fetchAllPosts();
  };

  const handlePostSearchKeyPress = (e) => {
    if (e.key === "Enter") searchPostsByKeyword();
  };

  const sortByPopularity = () => {
    const sorted = [...posts].sort(
      (a, b) => (b.upVote - b.downVote) - (a.upVote - a.downVote)
    );
    setPosts(sorted);
  };

  // ===== Pagination Calculation =====
  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags?.includes(selectedTag))
    : posts;
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <div className={isDarkMode ? 'dark bg-gray-900 min-h-screen' : 'bg-white min-h-screen'}>
      

      {/* ===== Banner Section ===== */}
      <section className="max-w-8xl mx-10 px-4 md:px-6 lg:px-8 py-20 mb-12">
        <div className={`rounded-2xl shadow-lg p-8 ${
          isDarkMode 
            ? 'bg-gray-800 text-white border border-gray-700' 
            : 'bg-indigo-500 text-white'
        }`}>
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={`p-3 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-white/20'
              }`}>
                <MdForum className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Welcome to <span className="text-white">ForumX</span>
              </h1>
            </div>
            <p className={`text-lg max-w-2xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-white/90'
            }`}>
              Explore posts, share your thoughts & discover trending topics!
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" />
                <input
                  type="text"
                  placeholder="Search posts by title or content..."
                  value={postSearchQuery}
                  onChange={(e) => setPostSearchQuery(e.target.value)}
                  onKeyPress={handlePostSearchKeyPress}
                  className={`w-full pl-12 pr-10 py-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-white focus:border-white' 
                      : 'bg-white/20 border-white/30 text-white placeholder-white/70 focus:ring-2 focus:ring-white focus:border-white'
                  } transition-all`}
                />
                {postSearchQuery && (
                  <button
                    onClick={clearPostSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-white/70 transition-colors"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              <button
                onClick={searchPostsByKeyword}
                disabled={searchLoading}
                className={`px-6 py-3 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2 min-w-[120px] ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-white text-indigo-600 hover:bg-gray-100'
                }`}
              >
                <FaSearch className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>

          {/* Tags Section */}
          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              <button
                onClick={handleAllTags}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !selectedTag
                    ? isDarkMode 
                      ? "bg-white text-gray-900 shadow-md" 
                      : "bg-white text-indigo-600 shadow-md"
                    : isDarkMode 
                      ? "bg-gray-700 text-white hover:bg-gray-600" 
                      : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <FaTag className="w-3 h-3" />
                All Tags
              </button>
              
              {tags.map((tag) => (
                <button
                  key={tag._id}
                  onClick={() => handleTagSelect(tag.name)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTag === tag.name
                      ? isDarkMode 
                        ? "bg-white text-gray-900 shadow-md" 
                        : "bg-white text-indigo-600 shadow-md"
                      : isDarkMode 
                        ? "bg-gray-700 text-white hover:bg-gray-600" 
                        : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  <FaTag className="w-3 h-3" />
                  {tag.name}
                </button>
              ))}
            </div>
            
            {tags.length === 0 && (
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-white/70'
              }`}>
                No tags available
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ===== Results Summary ===== */}
      <div className="max-w-8xl mx-20 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <p className={`p-2 rounded-lg border ${
          isDarkMode 
            ? 'bg-gray-800 text-gray-300 border-gray-600' 
            : 'bg-blue-50 text-gray-600 border-indigo-300'
        }`}>
          Showing <span className={`font-semibold ${
            isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
          }`}>{currentPosts.length}</span> of{" "}
          <span className={`font-semibold ${
            isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
          }`}>{filteredPosts.length}</span> posts
          {selectedTag && (
            <span className={`ml-2 ${
              isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
            }`}>
              (tag: <span className="font-semibold">"{selectedTag}"</span>)
            </span>
          )}
        </p>

        <button
          onClick={sortByPopularity}
          className={`p-2 rounded-lg border flex items-center gap-2 ${
            isDarkMode 
              ? 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700' 
              : 'bg-blue-50 text-gray-600 border-indigo-300 hover:bg-blue-100'
          }`}
        >
          <FaStar className={isDarkMode ? "text-indigo-400" : "text-indigo-500"} /> 
          Sort by Popularity
        </button>
      </div>

      {/* ===== Posts Section ===== */}
      <div className={`min-h-screen w-full relative overflow-hidden ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        {/* 🔹 Dashed Grid Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, ${isDarkMode ? '#374151' : '#e7e5e4'} 1px, transparent 1px),
              linear-gradient(to bottom, ${isDarkMode ? '#374151' : '#e7e5e4'} 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 0",
            maskImage: `
              repeating-linear-gradient(
                to right,
                black 0px,
                black 3px,
                transparent 3px,
                transparent 8px
              ),
              repeating-linear-gradient(
                to bottom,
                black 0px,
                black 3px,
                transparent 3px,
                transparent 8px
              )
            `,
            WebkitMaskImage: `
              repeating-linear-gradient(
                to right,
                black 0px,
                black 3px,
                transparent 3px,
                transparent 8px
              ),
              repeating-linear-gradient(
                to bottom,
                black 0px,
                black 3px,
                transparent 3px,
                transparent 8px
              )
            `,
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        />

        {/* 🔹 Foreground Content */}
        <div className="relative z-10 mb-20">
          {/* Header Section */}
          <div className="text-center mb-6">
            <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-xl mb-1 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>
              <h2 className="text-3xl font-bold">
                {selectedTag
                  ? `#${selectedTag}`
                  : postSearchQuery
                  ? `"${postSearchQuery}"`
                  : "Latest Posts"}
              </h2>
            </div>
            <div className="w-24 h-1 bg-indigo-600 mx-auto mb-6"></div>

            <p className={`text-lg ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {selectedTag
                ? `Posts tagged with ${selectedTag}`
                : postSearchQuery
                ? `Search results for your query`
                : "Discover the latest community discussions"}
            </p>
          </div>

          {/* Loading State */}
          {loading || searchLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className={`w-16 h-16 border-4 rounded-full ${
                  isDarkMode ? 'border-gray-700' : 'border-indigo-200'
                }`}></div>
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <p className={`mt-4 font-medium ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {searchLoading ? "Searching posts..." : "Loading posts..."}
              </p>
              <p className={`text-sm mt-2 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Please wait a moment
              </p>
            </div>
          ) : (
            /* Posts Grid */
            <div className="max-w-8xl mx-10 px-4 md:px-6 lg:px-8">
              {currentPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {currentPosts.map((post) => (
                    <article
                      key={post._id}
                      className={`group rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border overflow-hidden flex flex-col ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      {/* Post Image */}
                      {post.image && (
                        <div className="relative h-48 w-full overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className={`absolute inset-0 transition-colors ${
                            isDarkMode ? 'bg-black/30 group-hover:bg-black/20' : 'bg-black/10 group-hover:bg-black/5'
                          }`}></div>
                        </div>
                      )}

                      {/* Card Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        {/* Author Header */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="relative">
                            <img
                              src={post.authorImage || "/default-avatar.png"}
                              alt="Author"
                              className={`w-10 h-10 rounded-full border-2 object-cover group-hover:border-indigo-400 transition-colors ${
                                isDarkMode ? 'border-gray-600' : 'border-indigo-200'
                              }`}
                            />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold truncate ${
                              isDarkMode ? 'text-gray-100' : 'text-gray-900'
                            }`}>
                              {post.authorName || "Anonymous"}
                            </h3>
                            <p className={`text-xs flex items-center gap-1 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              <FaClock className="text-indigo-500" />
                              {new Date(post.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Title */}
                        <h2 className={`font-bold text-lg mb-3 leading-tight group-hover:text-indigo-500 transition-colors line-clamp-2 ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                          {post.title}
                        </h2>

                        {/* Description */}
                        {post.description && (
                          <p className={`text-sm mb-4 line-clamp-3 flex-1 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {post.description}
                          </p>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags?.map((tag, i) => (
                            <button
                              key={i}
                              onClick={() => handleTagSelect(tag)}
                              className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full border transition-all cursor-pointer ${
                                tag === selectedTag
                                  ? "bg-indigo-500 text-white border-indigo-500 shadow-lg"
                                  : isDarkMode
                                    ? "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:border-gray-500"
                                    : "bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 hover:shadow-md"
                              }`}
                            >
                              <FaTag className="w-3 h-3" />
                              {tag}
                            </button>
                          ))}
                        </div>

                        {/* Stats and Read More */}
                        <div className={`flex items-center justify-between pt-4 border-t mt-auto ${
                          isDarkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                          <div className="flex items-center gap-3 text-sm">
                            <span className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                              isDarkMode 
                                ? 'bg-indigo-900/40 text-indigo-300' 
                                : 'bg-indigo-50 text-indigo-600'
                            }`}>
                              <FaArrowUp className="w-3 h-3" />
                              {post.upVote || 0}
                            </span>
                            <span className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                              isDarkMode 
                                ? 'bg-indigo-900/40 text-indigo-300' 
                                : 'bg-indigo-50 text-indigo-600'
                            }`}>
                              <FaArrowDown className="w-3 h-3" />
                              {post.downVote || 0}
                            </span>
                          </div>

                          <Link
                            to={`/post/${post._id}`}
                            className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
                              isDarkMode
                                ? 'text-indigo-400 hover:text-indigo-300 bg-indigo-900/40 hover:bg-indigo-800/40'
                                : 'text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
                            }`}
                          >
                            Read More
                            <FaArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-16">
                  <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                    isDarkMode ? 'bg-gray-800' : 'bg-indigo-100'
                  }`}>
                    <MdForum className="w-10 h-10 text-indigo-500" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {selectedTag
                      ? `No posts found with "${selectedTag}"`
                      : postSearchQuery
                      ? `No results for "${postSearchQuery}"`
                      : "No posts available"}
                  </h3>
                  <p className={`mb-6 max-w-md mx-auto ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {selectedTag
                      ? "Try searching with a different tag or browse all posts"
                      : postSearchQuery
                      ? "Try adjusting your search terms or browse all posts"
                      : "Be the first to create a post in the community"}
                  </p>
                  {(selectedTag || postSearchQuery) && (
                    <button
                      onClick={handleAllTags}
                      className={`inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all ${
                        isDarkMode
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                      }`}
                    >
                      <FaTag className="w-4 h-4" />
                      View All Posts
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===== Pagination ===== */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`btn btn-sm disabled:opacity-50 ${
              isDarkMode 
                ? 'btn-outline text-gray-300 border-gray-600 hover:bg-gray-700' 
                : 'btn-outline'
            }`}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`btn btn-sm ${
                currentPage === i + 1 
                  ? isDarkMode ? 'bg-indigo-600 text-white' : 'btn-primary' 
                  : isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600' : 'btn-outline'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`btn btn-sm disabled:opacity-50 ${
              isDarkMode 
                ? 'btn-outline text-gray-300 border-gray-600 hover:bg-gray-700' 
                : 'btn-outline'
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* ===== Announcements ===== */}
      {announcements.length > 0 && (
        <section
          id="notifications"
          className={`mt-20 p-10 rounded-xl shadow-inner text-center ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-8">
            <FaBell className="text-3xl text-indigo-600" />
            <h2 className={`text-3xl font-bold ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}>
              Announcements
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
            {announcements.map((ann, idx) => (
              <div
                key={ann._id}
                data-aos="fade-up"
                data-aos-delay={idx * 100}
                className={`rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500 hover:shadow-2xl transition transform hover:-translate-y-2 w-full md:w-80 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-white'
                }`}
              >
                <div className="animate-pulse absolute -top-3 -left-3 bg-indigo-500 rounded-full p-3 shadow-lg text-white">
                  <FaBell />
                </div>
                <h3 className={`text-xl font-semibold mb-2 mt-4 ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  {ann.title}
                </h3>
                <p className={`mb-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {ann.description}
                </p>
                <p className={`text-sm flex items-center gap-2 justify-center ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  <FaClock className="text-indigo-400" /> 
                  {new Date(ann.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== Extra Sections ===== */}
      <HeroCarousel />
      <CountUpStats />
      <WhyChooseUs />
      <EarnBadges />
      <Testimonials />
      <CTA1 />
      <Faq />
    </div>
  );
};

export default Home;