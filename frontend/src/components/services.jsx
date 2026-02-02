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
                 style={{ backgroundImage: "url('/img/gallery/raihan01_1.jpg')" }}>
            </div>
            <div className="w-[400px] h-80 bg-white rounded-2xl bg-cover bg-center" 
                 style={{ backgroundImage: "url('/img/gallery/team06_1.png')" }}>
            </div>
            <div className="w-[400px] h-80 bg-white rounded-2xl bg-cover bg-center" 
                 style={{ backgroundImage: "url('/img/gallery/ai01_07_protWebControl.png')" }}>
            </div>
            <div className="w-[300px] h-80 bg-white rounded-2xl bg-cover bg-center" 
                 style={{ backgroundImage: "url('/img/gallery/ai01_06_pythonImplement.png')" }}>
            </div>
          </div>

          {/* Row 2 - Asimetris: Mega Wide + 2 vertical kecil di kanan */}
          <div className="flex flex-wrap justify-center gap-6">
            <div className="w-[600px] h-[400px] bg-white rounded-2xl bg-contain bg-center bg-no-repeat" 
              style={{ backgroundImage: "url('/img/gallery/architectureB01_v7.1.0_B1.png')" }}>
            </div>
            <div className="flex flex-col gap-6">
              <div className="w-80 h-[190px] bg-white rounded-2xl bg-cover bg-center" 
                style={{ backgroundImage: "url('/img/gallery/camset03_2.jpg')" }}>
              </div>
              <div className="w-80 h-[190px] bg-transparent rounded-2xl bg-cover bg-center" 
                style={{ backgroundImage: "url('/img/gallery/LogoB01_2.png')" }}>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="w-96 h-[135px] bg-transparent rounded-2xl bg-cover bg-center" 
                style={{ backgroundImage: "url('/img/gallery/boogie02_1.jpg')" }}>
              </div>
              <div className="w-96 h-[250px] bg-white rounded-2xl bg-cover bg-center" 
                style={{ backgroundImage: "url('/img/gallery/camset9.jpg')" }}>
              </div>
            </div>
            
            <div className="w-72 h-[400px] bg-white rounded-2xl bg-cover bg-center" 
             style={{ backgroundImage: "url('/img/gallery/Home01_2_Historis.jpg')" }}>
            </div>
          </div>

          {/* Row 3 - Asimetris: 2 kecil kiri, 1 super wide, 1 medium */}
          <div className="flex flex-wrap justify-center gap-6">
            <div className="w-64 h-72 bg-white rounded-2xl bg-cover bg-center" 
              style={{ backgroundImage: "url('/img/gallery/eka01_1.jpg')" }}>
            </div>
            <div className="w-96 h-72 bg-white rounded-2xl bg-cover bg-center" 
              style={{ backgroundImage: "url('/img/gallery/combination01_3.jpg')" }}>
            </div>
            <div className="w-[470px] h-72 bg-white rounded-2xl bg-cover bg-center bg-no-repeat" 
              style={{ backgroundImage: "url('/img/gallery/train08_1.jpg')" }}>
            </div>
            <div className="w-96 h-72 bg-white rounded-2xl bg-cover bg-center" 
              style={{ backgroundImage: "url('/img/gallery/diorama32_2.jpg')" }}>
            </div>
          </div>

          {/* Row 4 - Asimetris: 5 kotak dengan variasi ekstrem */}
          <div className="flex flex-wrap justify-center gap-6">
            <div className="w-96 h-96 bg-white rounded-2xl bg-cover bg-center" 
                 style={{ backgroundImage: "url('/img/gallery/camSolder01_1.png')" }}>
            </div>
            <div className="w-64 h-96 bg-white rounded-2xl bg-cover bg-center" 
                 style={{ backgroundImage: "url('/img/gallery/dioramaPlanning06_1.png')" }}>
            </div>
            <div className="w-[450px] h-96 bg-white rounded-2xl bg-cover bg-center" 
                 style={{ backgroundImage: "url('/img/gallery/train04_1.png')" }}>
            </div>
            <div className="w-80 h-96 bg-white rounded-2xl bg-cover bg-center" 
                 style={{ backgroundImage: "url('/img/gallery/team09_5.jpg')" }}>
            </div>
            <div className="w-72 h-96 bg-white rounded-2xl bg-cover bg-center" 
                style={{ backgroundImage: "url('/img/gallery/team03_2.jpg')" }}>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};