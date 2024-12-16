export default function LoadingSpinner() {
  return (
    <>
      <div className="relative flex justify-center items-center max-w-5xl mx-auto min-h-screen">
        <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-orange-500"></div>
        <img src="/loading-guitar.png" className="rounded-full h-28 w-28" />
      </div>
    </>
  );
}
