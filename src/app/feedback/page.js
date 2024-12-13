import Link from "next/link";
import Button from "../components/Button";
import Nav from "../components/Nav";
import Image from "next/image";
export default function Feedback(){
    return(
        <>
        <Nav />
        <div className="h-screen flex flex-col justify-center items-center relative">

        {/* Background Image */}
        <Image
          src="/images/Union.svg"
          alt="Polygon Background"
          layout="fill"
          objectFit="contain"
          className="absolute z-[-1] p-4"
        />
  
        {/* Top Section */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-[90%] top-0 flex justify-between items-center h-[100px] 2xl:px-16 px-4">
          <Link href="/home">
            <h4 className="text-3xl cursor-pointer text-black">Clio</h4>
          </Link>
        </div>

        {/* feedback Section */}
        <div className="flex justify-between gap-[100px] min-h-screen py-2">
            <div className="flex flex-col items-start justify-center">
                <div><h4 className="text-black text-[30px]">We Value Your Feedback</h4></div>
                <div><p className="text-black text-[14px] opacity-80">We’re always looking to improve your experience. Share your thoughts <br></br> and suggestions with us!</p></div>
                <input className="border-2 text-[12px] bg-ivory font-body mt-12 text-black border-black px-4 py-2 w-3/4 rounded-full" type="text"  placeholder="Name" />
                <input className="border-2 text-[12px] bg-ivory mt-4 mb-4 font-body text-black border-black px-4 py-2 w-3/4 rounded-full" type="text"  placeholder="Email Address" />
                <textarea className="border-2 text-[12px] h-40 bg-ivory mb-4 font-body text-black border-black px-4 py-2 w-3/4 rounded-[20px]"  placeholder="share your thoughts..."></textarea>
                <Button text = "Submit"></Button>
            </div>

            <img 
            src = "/images/feedback.svg"
            height={392}
            width = {400}
            />

      </div>
      </div>
      
      </>
    );
}