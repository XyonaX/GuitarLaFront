export default function Features() {
  return (
    <div>
      <section className="max-5-xl mx-auto py-20 px-8">
        <h2 className="text-4xl text-center font-bold text-orange-500 mb-12">
          ¿Por qué elegirnos?
        </h2>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <img src="/entrega-rapida.png" alt="" className="h-24 mb-2" />
            <h3 className="text-lg text-orange-700 font-bold">
              Entrega rápida
            </h3>
            <p className="text-center">
              Recibe tu nueva guitarra rápidamente en la puerta de tu casa,
              lista para que empieces a tocar.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="/garantia-de-reembolso.png"
              alt=""
              className="h-24 mb-2"
            />
            <h3 className="text-lg text-orange-700 font-bold">Garantía</h3>
            <p className="text-center">
              Compra con confianza: si no estás satisfecho, ofrecemos una
              garantía de reembolso sin complicaciones.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <img src="/productos-calidad.png" alt="" className="h-24 mb-2" />
            <h3 className="text-lg text-orange-700 font-bold">
              Productos de calidad
            </h3>
            <p className="text-center">
              Nuestras guitarras están hechas con materiales de primera calidad,
              asegurando un sonido excepcional y durabilidad.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
