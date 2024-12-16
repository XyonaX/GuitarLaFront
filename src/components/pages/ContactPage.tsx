import { useForm } from "react-hook-form";
import useEmailStore from "../../store/emailStore";
import ErrorFormMessage from "../forms/ErrorFormMessage";
import { useState } from "react";

type FormData = {
  userEmail: string;
  subject: string;
  text: string;
};

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const setUserEmail = useEmailStore((state) => state.setUserEmail);
  const sendEmail = useEmailStore((state) => state.sendEmail);

  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      await sendEmail(data);
      setEmailSent(true);
      reset();
      setUserEmail(data.userEmail);
      setTimeout(() => {
        setEmailSent(false);
      }, 3000);
    } catch (error) {
      setEmailError(true);
      setTimeout(() => {
        setEmailError(false);
      }, 3000);
    }
  };

  return (
    <div>
      <main>
        <section className="max-w-5xl mx-auto min-h-screen py-16">
          <h2 className="text-5xl text-center text-orange-600 font-bold mb-10 ">
            Contacto
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-xl mx-auto py-8 px-10 space-y-4 bg-white rounded-xl"
          >
            <div>
              <label htmlFor="userEmail">Email:</label>
              <input
                type="email"
                id="userEmail"
                className="border p-2 w-full"
                {...register("userEmail", {
                  required: "El email es obligatorio",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "El email no es válido",
                  },
                })}
              />
              {errors.userEmail && (
                <ErrorFormMessage>{errors.userEmail.message}</ErrorFormMessage>
              )}
            </div>
            <div>
              <label htmlFor="subject">Asunto:</label>
              <input
                type="text"
                id="subject"
                {...register("subject", {
                  required: "El asunto es obligatorio",
                })}
                className="border p-2 w-full"
              />
              {errors.subject && (
                <ErrorFormMessage>{errors.subject.message}</ErrorFormMessage>
              )}
            </div>
            <div>
              <label htmlFor="text">Mensaje:</label>
              <textarea
                id="text"
                {...register("text", { required: "El mensaje es obligatorio" })}
                className="border p-2 w-full"
              />
              {errors.text && (
                <ErrorFormMessage>{errors.text.message}</ErrorFormMessage>
              )}
            </div>
            <button
              type="submit"
              className="font-bold uppercase bg-orange-600 hover w-full text-white p-2 rounded-md"
            >
              Enviar
            </button>
            {emailSent && (
              <p
                className={`text-center text-green-600 bg-green-200 text-lg font-bold py-2 mt-4 transition-opacity duration-1000 ${
                  emailSent ? "opacity-100" : "opacity-0"
                }`}
              >
                Correo electrónico enviado correctamente
              </p>
            )}
            {emailError && (
              <p
                className={`text-center text-red-600 bg-red-200 text-lg font-bold py-2 mt-4 transition-opacity duration-1000 ${
                  emailSent ? "opacity-100" : "opacity-0"
                }`}
              >
                Error al enviar el correo electrónico
              </p>
            )}
          </form>
        </section>
      </main>
    </div>
  );
}
