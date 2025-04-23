import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Posts as PostsType } from '../types';
import { supabase } from '../supabase';

const Posts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'my-lists' | 'shared'>('my-lists');
  const [postLists, setPostLists] = useState<PostsType[]>([]);
  const [sharedLists, setSharedLists] = useState<PostsType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPostLists();
  }, [user?.id]);

  const fetchPostLists = async () => {
    if (!user?.id) {
      setIsLoading(false)
      return;
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('stremear_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPostLists(data || []);
    } catch (err) {
      console.error('Error fetching post lists:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteList = async (listId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('¿Estás seguro de que quieres eliminar esta lista?')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', listId);

      if (error) throw error;
      await fetchPostLists();
    } catch (err) {
      console.error('Error deleting post list:', err);
      alert('Error al eliminar la lista');
    }
  };

  const handleEditList = (listId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/posts/edit/${listId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Listas de Posteos</h1>
          <button
            onClick={() => navigate('/posts/create')}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Crear Nueva Lista</span>
          </button>
        </div>

        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('my-lists')}
              className={`${activeTab === 'my-lists'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Mis Listas
            </button>
            <button
              onClick={() => setActiveTab('shared')}
              className={`${activeTab === 'shared'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Listas Compartidas
            </button>
          </nav>
        </div>

        {activeTab === 'my-lists' ? (
          <div>
            {postLists.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <p className="text-gray-500 mb-4">No has creado ninguna lista de posteos aún.</p>
                <button
                  onClick={() => navigate('/posts/create')}
                  className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Crear Mi Primera Lista</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {postLists.map((list) => (
                  <div
                    key={list.id}
                    onClick={() => navigate(`/posts/${list.id}`)}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <h3 className="text-lg font-semibold mb-2">{list.title}</h3>
                    <p className="text-gray-600 mb-4">{list.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Creado el {new Date(list.created_at).toLocaleDateString()}</span>
                      <div className="flex space-x-4">
                        <button
                          onClick={(e) => handleEditList(list.id!, e)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          Editar
                        </button>
                        <button
                          onClick={(e) => handleDeleteList(list.id!, e)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {sharedLists.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <p className="text-gray-500">No hay listas compartidas contigo en este momento.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sharedLists.map((list) => (
                  <div
                    key={list.id}
                    onClick={() => navigate(`/posts/${list.id}`)}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <h3 className="text-lg font-semibold mb-2">{list.title}</h3>
                    <p className="text-gray-600 mb-4">{list.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Compartido el {new Date(list.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
