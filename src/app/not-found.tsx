import Link from "next/link";

export default function NotFound() {
  return (
    <>
    <div className="main-content min-h-screen bg-black">
      
      {/* Signup Form Section */}
      <section className="bg-black p-10 relative pt-36 flex flex-col items-center">
        <div className="w-[630px] text-center">
          <h3 className="text-[96px] font-bold text-orange-500 mb-6">404</h3>
          <p className="font-bold text-[32px] mb-4 text-white">
            Oops! Looks like something went wrong
          </p>
          <p className="text-[18px] mb-4">
            Page cannot be found! We’ll have it figured out in no time.
          </p>
          <p className="text-[18px] mb-6">
            Meanwhile, check out these fresh ideas:
          </p>
          {/* Button */}
          <Link href="/">
            <button className="bg-orange-500 text-white text-[18px] font-bold px-6 py-2 rounded hover:bg-orange-600">
              Go Back to Home
            </button>
          </Link>
        </div>
      </section>
    </div>
 </>
  );
}