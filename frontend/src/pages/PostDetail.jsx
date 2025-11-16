import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogApi } from '../api/axios';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await blogApi.get(`/api/posts/${id}`);
      setPost(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Post not found');
      } else {
        setError('Failed to fetch post');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-xl">Loading post...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Go back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
      >
        ← Back
      </button>
      <article className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="flex gap-4 text-sm text-gray-500 mb-6">
          <span>Author ID: {post.author_id}</span>
          <span>•</span>
          <span>Created: {new Date(post.created_at).toLocaleString()}</span>
          {post.updated_at !== post.created_at && (
            <>
              <span>•</span>
              <span>Updated: {new Date(post.updated_at).toLocaleString()}</span>
            </>
          )}
        </div>
        <div className="prose max-w-none">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
