import AboutUs from "../home/AboutUs";

export default function AboutUsPage() {
  return (
    <>
      <main>
        <section className="max-w-5xl mx-auto min-h-screen py-16">
          <h2 className="text-5xl text-center text-orange-600 font-bold mb-10 ">
            Sobre Nosotros
          </h2>
          <AboutUs />
        </section>
      </main>
    </>
  );
}