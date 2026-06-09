import React from 'react';
import { BookOpen, Calendar, User, Search, CornerDownRight } from 'lucide-react';
import { BlogPost } from '../types';

export default function BlogRoom() {
  const [blogs, setBlogs] = React.useState<BlogPost[]>([]);
  const [selectedBlog, setSelectedBlog] = React.useState<BlogPost | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState('Tất cả');

  React.useEffect(() => {
    setLoading(true);
    fetch('/api/blogs')
      .then((res) => res.json())
      .then((data) => {
        setBlogs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching blogs:', err);
        setBlogs([]);
        setLoading(false);
      });
  }, []);

  const categories = [
    'Tất cả',
    'Tin thị trường',
    'Phân tích giá',
    'Kinh nghiệm mua nhà',
    'Kinh nghiệm đầu tư',
    'Tin tức Vinhomes Ocean Park',
  ];

  const filteredBlogs = selectedCategory === 'Tất cả'
    ? blogs
    : blogs.filter((b) => b.category === selectedCategory);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-cyan-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400 mx-auto mb-2"></div>
        <p>Đang tải tin tức & bài viết tư vấn...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="blog-room">
      {/* Blog Detail view */}
      {selectedBlog ? (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in text-xs font-semibold">
          <button
            onClick={() => setSelectedBlog(null)}
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-bold underline mb-4"
          >
            ← Quay lại danh sách tin tức
          </button>

          {/* Large image banner */}
          <div className="relative h-[320px] rounded-2xl overflow-hidden bg-slate-950 border border-cyan-950/50">
            <img
              src={selectedBlog.image}
              alt={selectedBlog.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <span className="bg-cyan-950 border border-cyan-800 text-cyan-400 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                {selectedBlog.category}
              </span>
              <h1 className="text-xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight leading-tight">
                {selectedBlog.title}
              </h1>
            </div>
          </div>

          {/* Meta specs */}
          <div className="flex items-center space-x-4 border-b border-cyan-950/40 pb-4 text-xs font-medium text-slate-400">
            <div className="flex items-center">
              <User className="w-4 h-4 text-slate-500 mr-1.5" />
              <span>{selectedBlog.author}</span>
            </div>
            <div>•</div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-slate-500 mr-1.5" />
              <span>{selectedBlog.createdAt}</span>
            </div>
          </div>

          {/* Paragraph body */}
          <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line space-y-4">
            {selectedBlog.content}
          </div>
        </div>
      ) : (
        // Blog Directories list
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center justify-center sm:justify-start">
              <BookOpen className="w-6 h-6 text-cyan-500 mr-2.5" /> Tin Tức & Cố Vấn BĐS Vinhomes
            </h1>
            <p className="text-xs text-slate-400 mt-1">Cung cấp báo cáo thị trường, định giá chuyên sâu và cẩm nang sống hữu ích tại Vinhomes Ocean Park.</p>
          </div>

          {/* Categories bar */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-4 border-b border-cyan-950/40">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap tracking-wide leading-none transition ${
                  selectedCategory === cat
                    ? 'bg-cyan-950 border border-cyan-500 text-cyan-400 font-bold shadow-md shadow-cyan-500/5'
                    : 'bg-slate-900 border border-cyan-950/50 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Main layout blogs lists */}
          {filteredBlogs.length === 0 ? (
            <p className="text-slate-500 text-center py-12 text-xs font-semibold">Hiện chưa có bài báo nào thuộc chủ đề này.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedBlog(post)}
                  className="bg-slate-900 border border-cyan-950 rounded-2xl overflow-hidden hover:border-cyan-500/40 hover:shadow-cyan-500/5 transition duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition duration-300 hover:scale-103"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-4 left-4 bg-slate-950/80 border border-cyan-850 text-white text-[9px] uppercase tracking-widest font-extrabold px-2.5 py-1 rounded">
                      {post.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center text-[10px] text-slate-500 font-semibold mb-1.5 space-x-3">
                        <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {post.createdAt}</span>
                        <span>•</span>
                        <span>{post.author.slice(0, 16)}...</span>
                      </div>
                      <h3 className="text-white font-bold text-sm tracking-tight leading-snug line-clamp-2 hover:text-cyan-400 transition mb-2">
                        {post.title}
                      </h3>
                      <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                        {post.summary}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-cyan-950/40 flex items-center justify-between text-xs font-semibold text-cyan-400">
                      <span>Đọc tiếp bài viết</span>
                      <CornerDownRight className="w-4 h-4 text-cyan-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
