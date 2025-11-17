import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogApi } from '../api/axios';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await blogApi.get('/posts/');
      setPosts(response.data);
    } catch (err) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-xl">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Latest Posts</h1>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      )}
      {posts.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No posts yet. Be the first to create one!
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Author ID: {post.author_id}</span>
                <span>
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
              <Link
                to={`/posts/${post.id}`}
                className="mt-4 inline-block text-blue-600 hover:text-blue-800"
              >
                Read more →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
