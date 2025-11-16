import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogApi } from '../api/axios';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const response = await blogApi.get('/api/posts/user/me');
      setPosts(response.data);
    } catch (err) {
      setError('Failed to fetch your posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await blogApi.delete(`/api/posts/${postId}`);
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-xl">Loading your posts...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Posts</h1>
        <Link
          to="/create-post"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Post
        </Link>
      </div>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      )}
      {posts.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          You haven&apos;t created any posts yet.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white shadow-md rounded-lg p-6 flex justify-between items-start"
            >
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                <div className="text-sm text-gray-500">
                  Created: {new Date(post.created_at).toLocaleString()}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Link
                  to={`/posts/${post.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
