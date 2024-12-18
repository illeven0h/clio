import Button from "../components/Button";
import Image from "next/image";
import Nav from "../components/Nav";
import Link from "next/link";
export default function Create() {
    return (
        <>
        <Nav className="mt-4" clioClassName ="text-black mt-2 ml-8" logoutClassName="mt-3 mr-8" />
        <div className="h-screen flex flex-col justify-center items-center relative">

        {/* Background Image */}
        <Image
          src="/images/Union.svg"
          alt="Polygon Background"
          layout="fill"
          objectFit="contain"
          className="absolute z-[-1] p-4"
        />
  


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