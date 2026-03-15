import Link from "next/link";
import Image from "next/image";
import ForAllHeroSections from "../../../components/ForAllHeroSections";

export default function SignInPage() {
  return (
    <div className="main-content min-h-screen bg-black">
      {/* Header */}
      
      <ForAllHeroSections/>

      {/* Signin Form */}
      <section className="py-16">
        <div className="container mx-auto max-w-md bg-gray-800 shadow-lg rounded-md p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Sign In</h3>
          <form>
            <div className="mb-4">
              <label className="block mb-2 font-medium ">Email</label>
              <div className="flex items-center border rounded px-3 py-2">
                <Image src="/Envelope.png" alt="Email Icon" width={16} height={16} className="mr-2" />
                <input
                  type="email"
                  className="w-full focus:ring focus:ring-gray-500 outline-1 bg-gray-800"
                  placeholder="Email"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium bg-gray-800">Password</label>
              <div className="flex items-center border rounded px-3 py-2">
                <Image src="/Lock.png" alt="Password Icon" width={16} height={16} className="mr-2" />
                <input
                  type="password"
                  className="w-full focus:ring focus:ring-gray-500 outline-1 bg-gray-800"
                  placeholder="Password"
                />
              </div>
            </div>
            <div className="flex items-center mb-4">
              <input type="checkbox" className="mr-2" />
              <span>Remember me?</span>
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded"
            >
              Sign In
            </button>
            <p className="text-center mt-4">
              <Link href="/forgot-password" className="text-yellow-500">Forgot password?</Link>
            </p>
          </form>
          <div className="text-center mt-8">
            <p>or</p>
            <button className="w-full bg-gray-100 border text-black py-2 rounded mt-2 flex items-center justify-center">
              <Image src="/Google.png" alt="Google Icon" width={20} height={20} className="mr-2" />
              Sign in with Google
            </button>
            <button className="w-full bg-gray-100 border text-black py-2 rounded mt-2 flex items-center justify-center">
              <Image src="/Apple.png" alt="Apple Icon" width={20} height={20} className="mr-2" />
              Sign in with Apple
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
