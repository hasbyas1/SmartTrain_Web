export const Services = (props) => {
  return (
    <div id="services" className="text-center py-8">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="section-title mb-8">
          <h2 className="font-bold text-2xl mb-2">Gallery</h2>
          <p className="text-gray-600">
            Here comes the gallery of our project.
          </p>
        </div>

        {/* Container bento - ASIMETRIS */}
        <div className="flex flex-col gap-6">
          
          {/* Row 1 - Asimetris: Small, Extra Large, Medium, Small */}
          <div className="flex flex-wrap justify-center gap-6">
            <div className="w-72 h-80 bg-white rounded-2xl bg-cover bg-center" 
                 style={{ backgroundImage: "url('/img/portofolio/01-large.jpg')" }}>
            </div>
            <div className="w-[550px] h-80 bg-white rounded-2xl bg-cover bg-center" 
                 style={{ backgroundImage: "url('/img/portofolio/02-large.jpg')" }}>
            </div>
            <div className="w-96 h-80 bg-white rounded-2xl bg-cover bg-center" 
                 style={{ backgroundImage: "url('/img/portofolio/03-large.jpg')" }}>
            </div>
            <div className="w-80 h-80 bg-white rounded-2xl bg-cover bg-center" 
                 style={{ backgroundImage: "url('/img/portofolio/04-large.jpg')" }}>
            </div>
          </div>

          {/* Row 2 - Asimetris: Mega Wide + 2 vertical kecil di kanan */}
          <div className="flex flex-wrap justify-center gap-6">
            <div className="w-[600px] h-[400px] bg-white rounded-2xl bg-contain bg-center bg-no-repeat" 
              style={{ backgroundImage: "url('/img/gallery/architectureB01_v7.1.0_B1.png')" }}>
            </div>
            <div className="flex flex-col gap-6">
              <div className="w-80 h-[190px] bg-white rounded-2xl bg-cover bg-center" 
                style={{ backgroundImage: "url('/img/portofolio/06-large.jpg')" }}>
              </div>
              <div className="w-80 h-[190px] bg-transparent rounded-2xl bg-cover bg-center" 
                style={{ backgroundImage: "url('/img/gallery/Logo01_2.png')" }}>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="w-80 h-[105px] bg-transparent rounded-2xl bg-cover bg-center" 
                style={{ backgroundImage: "url('/img/gallery/Logo01_2.png')" }}>
              </div>
              <div className="w-96 h-[250px] bg-white rounded-2xl bg-cover bg-center" 
                style={{ backgroundImage: "url('/img/portofolio/08-large.jpg')" }}>
              </div>
            </div>
            
            <div className="w-72 h-[400px] bg-white rounded-2xl bg-cover bg-center" 
              style={{ backgroundImage: "url('/img/portofolio/08-large.jpg')" }}>
            </div>
          </div>

          {/* Row 3 - Asimetris: 2 kecil kiri, 1 super wide, 1 medium */}
          <div className="flex flex-wrap justify-center gap-6">
            <div className="w-64 h-72 bg-white rounded-2xl bg-cover bg-center" 
              style={{ backgroundImage: "url('/img/portofolio/09-large.jpg')" }}>
            </div>
            <div className="w-80 h-72 bg-white rounded-2xl bg-cover bg-center" 
              style={{ backgroundImage: "url('/img/portofolio/10-large.jpg')" }}>
            </div>
            <div className="w-[650px] h-72 bg-white rounded-2xl bg-cover bg-center" 
              style={{ backgroundImage: "url('/img/portofolio/11-large.jpg')" }}>
            </div>
            <div className="w-96 h-72 bg-white rounded-2xl bg-cover bg-center" 
              style={{ backgroundImage: "url('/img/portofolio/12-large.jpg')" }}>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};