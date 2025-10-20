import React, { useState, useEffect } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import {
FaBell, FaArrowUp, FaArrowDown, FaComment, FaTag,
FaClock, FaStar, FaPenFancy, FaSearch, FaTimes,
FaArrowRight
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




const Home = () => {
const axiosSecure = useAxiosSecure();




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
  <div>

  {/* ===== Banner Section ===== */}
<section className=" max-w-8xl mx-10 px-4 md:px-6 lg:px-8 mt-20 mb-12">
  <div className="bg-indigo-600 rounded-2xl shadow-lg p-8 text-white">
    {/* Header Section */}
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="bg-white/20 p-3 rounded-lg">
          <MdForum className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">
          Welcome to <span className="text-white">ForumX</span>
        </h1>
      </div>
      <p className="text-lg text-white/90 max-w-2xl mx-auto">
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
            className="w-full pl-12 pr-10 py-3 rounded-lg border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all"
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
          className="bg-white text-indigo-600 px-6 py-3 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2 min-w-[120px]"
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
              ? "bg-white text-indigo-600 shadow-md"
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          <FaTag className="w-3 h-3" />
          All Tags
        </button>
        
        {tags.map((tag,) => (
          <button
            key={tag._id}
            onClick={() => handleTagSelect(tag.name)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTag === tag.name
                ? "bg-white text-indigo-600 shadow-md"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            <FaTag className="w-3 h-3" />
            {tag.name}
          </button>
        ))}
      </div>
      
      {tags.length === 0 && (
        <p className="text-white/70 text-sm">No tags available</p>
      )}
    </div>
  </div>
</section>

  {/* ===== Results Summary ===== */}
  <div className=" max-w-8xl mx-20 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
    <p className="text-gray-600 bg-blue-50 p-2 rounded-lg border border-indigo-300">
      Showing <span className="font-semibold text-indigo-600">{currentPosts.length}</span> of{" "}
      <span className="font-semibold text-indigo-600">{filteredPosts.length}</span> posts
      {selectedTag && (
        <span className="text-indigo-600 ml-2">
          (tag: <span className="font-semibold">"{selectedTag}"</span>)
        </span>
      )}
    </p>

    <button
      onClick={sortByPopularity}
      className=" bg-blue-50  p-2 rounded-lg border border-indigo-300 flex items-center gap-2"
    >
      <FaStar className="text-indigo-500" /> Sort by Popularity
    </button>
  </div>
{/* max-w-7xl mx-auto */}






  {/* ===== Posts Section ===== */}

<div className="min-h-screen w-full relative overflow-hidden">
  {/* 🔹 Dashed Grid Background */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
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
  <div className="relative z-10 mb-8">
    {/* Header Section */}
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-3 bg-indigo-500 text-white px-6 py-4 rounded-xl shadow-lg mb-4">
        <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
          <MdForum className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold">
          {selectedTag
            ? `#${selectedTag}`
            : postSearchQuery
            ? `"${postSearchQuery}"`
            : "Latest Posts"}
        </h2>
      </div>

      <p className="text-gray-600 text-sm">
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
          <div className="w-16 h-16 border-4 border-indigo-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="text-gray-600 mt-4 font-medium">
          {searchLoading ? "Searching posts..." : "Loading posts..."}
        </p>
        <p className="text-gray-400 text-sm mt-2">Please wait a moment</p>
      </div>
    ) : (
      /* Posts Grid */
      <div className="max-w-8xl mx-10 px-4 md:px-6 lg:px-8">
        {currentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {currentPosts.map((post) => (
              <article
                key={post._id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col"
              >
                {/* Post Image */}
                {post.image && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
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
                        className="w-10 h-10 rounded-full border-2 border-indigo-200 object-cover group-hover:border-indigo-400 transition-colors"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {post.authorName || "Anonymous"}
                      </h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
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
                  <h2 className="font-bold text-lg text-gray-900 mb-3 leading-tight group-hover:text-indigo-500 transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Description */}
                  {post.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
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
                            : "bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 hover:shadow-md"
                        }`}
                      >
                        <FaTag className="w-3 h-3" />
                        {tag}
                      </button>
                    ))}
                  </div>

                  {/* Stats and Read More */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600">
                        <FaArrowUp className="w-3 h-3" />
                        {post.upVote || 0}
                      </span>
                      <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600">
                        <FaArrowDown className="w-3 h-3" />
                        {post.downVote || 0}
                      </span>
                    </div>

                    <Link
                      to={`/post/${post._id}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors"
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
            <div className="w-24 h-24 mx-auto mb-6 bg-indigo-100 rounded-full flex items-center justify-center">
              <MdForum className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {selectedTag
                ? `No posts found with "${selectedTag}"`
                : postSearchQuery
                ? `No results for "${postSearchQuery}"`
                : "No posts available"}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {selectedTag
                ? "Try searching with a different tag or browse all posts"
                : postSearchQuery
                ? "Try adjusting your search terms or browse all posts"
                : "Be the first to create a post in the community"}
            </p>
            {(selectedTag || postSearchQuery) && (
              <button
                onClick={handleAllTags}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
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

  {/* ===== Announcements ===== */}
  {announcements.length > 0 && (
    <section
      id="notifications"
      className="mt-20 p-10 bg-gray-50 rounded-xl shadow-inner text-center"
    >
      <div className="flex items-center justify-center gap-2 mb-8">
        <FaBell className="text-3xl text-indigo-600" />
        <h2 className="text-3xl font-bold text-gray-800">Announcements</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
        {announcements.map((ann, idx) => (
          <div
            key={ann._id}
            data-aos="fade-up"
            data-aos-delay={idx * 100}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500 hover:shadow-2xl transition transform hover:-translate-y-2 w-full md:w-80"
          >
            <div className="animate-pulse absolute -top-3 -left-3 bg-indigo-500 rounded-full p-3 shadow-lg text-white">
              <FaBell />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">{ann.title}</h3>
            <p className="text-gray-600 mb-4">{ann.description}</p>
            <p className="text-sm text-gray-400 flex items-center gap-2 justify-center">
              <FaClock className="text-indigo-400" /> {new Date(ann.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </section>
  )}

  {/* ===== Extra Sections ===== */}
  <CountUpStats />
  <WhyChooseUs />
  <EarnBadges />
  <Testimonials />
  <CTA1></CTA1>
</div>




);
};




export default Home;