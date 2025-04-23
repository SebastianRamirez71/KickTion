const Home = () => {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Bienvenido a KickTion</h2>
      <p className="text-gray-600 mb-6">
        Create and manage your own lists of posts. Sign in to get started and organize your content in a way that makes sense to you.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Organize Content</h3>
          <p className="text-gray-600">Create custom lists to organize your posts by topic, theme, or any other category you choose.</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Easy Management</h3>
          <p className="text-gray-600">Add, remove, and reorder posts in your lists with a simple and intuitive interface.</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Share with Others</h3>
          <p className="text-gray-600">Share your curated lists with the community and discover content from other users.</p>
        </div>
      </div>
    </div>
    )
  }
  
  export default Home
  