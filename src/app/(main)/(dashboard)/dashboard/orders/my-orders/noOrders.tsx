export const NoOrders = () => {
  return (
    <section className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-start p-8">
      <svg
        width="150"
        height="150"
        viewBox="0 0 150 150"
        className="fill-primary mb-8"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M118.75 6.25L110.875 23.4375L93.75 31.25L110.875 39.125L118.75 56.25L126.562 39.125L143.75 31.25L126.562 23.4375M56.25 25L40.625 59.375L6.25 75L40.625 90.625L56.25 125L71.875 90.625L106.25 75L71.875 59.375M118.75 93.75L110.875 110.875L93.75 118.75L110.875 126.562L118.75 143.75L126.562 126.562L143.75 118.75L126.562 110.875" />
      </svg>
      <h3 className="mb-4">Your SubPort Adventure Begins!</h3>
      <p className="mb-8 text-center">
        Ahoy there! You&apos;ve successfully docked at SubPort. So many unique
        shops are waiting to be discovered in our vibrant marketplace. Why not
        take the helm, explore the currents of cool products, and reel in your
        first treasure?
      </p>
    </section>
  );
};
