
import UsersForm from "../forms/UsersForm";

export default function Login() {
  return (
    <main>
      <section className="max-w-5xl mx-auto min-h-screen py-16">
        <h2 className="text-5xl text-center text-orange-600 font-bold mb-10">
          Inicia sesión
        </h2>
        <UsersForm/>
        <div className="text-center mt-4">
          <p className="text-gray-600">
            ¿No tienes una cuenta?{" "}
            <a href="/register" className="text-indigo-500 underline">
              Regístrate aquí
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
