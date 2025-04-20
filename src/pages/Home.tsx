const Home = () => {
    return (
      <div className="space-y-8">
        <section className="text-center py-12">
          <h1 className="text-4xl font-bold text-[#53b848] mb-4">Bienvenido a KickTion</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Una plataforma minimalista para compartir contenido y conectar con otros.
          </p>
        </section>
  
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-[#53b848] mb-2">Característica {item}</h3>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.
              </p>
            </div>
          ))}
        </section>
  
        <section className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-[#53b848] mb-4">Contenido Destacado</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white p-4 rounded-md shadow-sm">
                <h4 className="font-medium mb-2">Título del Post {item}</h4>
                <p className="text-sm text-gray-500">Breve descripción del contenido que se mostrará en este post...</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  }
  
  export default Home
  