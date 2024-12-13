import Button from "../components/Button";
import Image from "next/image";
import Link from "next/link";
import Nav from "../components/Nav";
export default function Create() {
    return (
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


        <div className="gap-4 flex flex-col items-center w-full">
        <h4 className=" text-black text-2xl">got an idea? let's create it!</h4>
        <div className="flex w-2/4 justify-center items-center gap-2 ">
         <input 
         className="bg-white w-full border-2 border-black text-[12px] font-body text-gray-800 px-4 py-2.5 rounded-full" 
         type="text"  
         placeholder="Describe your add..." />
         
         <Button className="rounded-full">
            <img 
            src = "/arrow.svg"
            height={24}
            width={24}
            />
         </Button>

        </div>
        </div>
        
      </div>
      </>

    );

}