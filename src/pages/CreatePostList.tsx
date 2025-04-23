import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Posts as PostsType } from '../types';
import { supabase } from '../supabase';

const CreatePostList = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPostList();
    }
  }, [id]);

  const fetchPostList = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setTitle(data.title);
      setDescription(data.description || '');
    } catch (err) {
      console.error('Error fetching post list:', err);
      alert('Error al cargar la lista');
      navigate('/posts');
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      alert('Debes iniciar sesión para crear una lista de posteos');
      return;
    }

    setIsLoading(true);

    try {
      if (id) {
        // Editar lista existente
        const { error } = await supabase
          .from('posts')
          .update({
            title,
            description,
            updated_at: new Date(),
          })
          .eq('id', id);

        if (error) throw error;
      } else {
        // Crear nueva lista
        const newPostList: PostsType = {
          stremear_id: user.id,
          title,
          description,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        };

        const { error } = await supabase
          .from('posts')
          .insert([newPostList])
          .select()
          .single();

        if (error) throw error;
      }

      navigate('/posts');
    } catch (err) {
      console.error('Error saving post list:', err);
      alert('Error al guardar la lista');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/posts')}
            className="mr-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            {id ? 'Editar Lista' : 'Crear Nueva Lista'}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título de la Lista
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Ingresa el título de tu lista"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Describe el contenido de tu lista"
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => navigate('/posts')}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {id ? 'Guardando...' : 'Creando...'}
                  </div>
                ) : (
                  id ? 'Guardar Cambios' : 'Crear Lista'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostList; 