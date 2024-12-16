import RegisterForm from "../forms/RegisterForm";

export default function Register() {
  const closeModal = () => {}; // Función vacía
  const onUserChange = () => {}; // Función vacía

  return (
    <main>
      <section className="max-w-5xl mx-auto min-h-screen py-16">
        <h2 className="text-5xl text-center text-orange-600 font-bold mb-10 ">
          Registro
        </h2>
        <RegisterForm closeModal={closeModal} onUserChange={onUserChange} />
        <div className="text-center mt-4">
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <a href="/login" className="text-indigo-500 underline">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
