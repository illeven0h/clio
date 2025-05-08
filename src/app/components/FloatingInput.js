"use client";
import { useRouter } from "next/navigation";
import { FaArrowUpLong } from "react-icons/fa6";

export default function FloatingInput() {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/home/chat")}
      className="fixed flex justify-between items-center gap-4 bottom-10 left-1/2 transform -translate-x-1/2 w-full sm:w-[500px] md:w-[600px] lg:w-[700px] xl:w-[750px] bg-background shadow-[6px_6px_0px_0px_#333333] rounded-[40px] p-4 border-4 border-grey cursor-pointer"
    >
      <p className="text-grey text-opacity-80 pl-2">Describe your add...</p>
      <div className="flex items-center justify-center w-12 h-10 bg-[#CBFF9C] text-black rounded-full shadow-[3px_3px_0px_0px_rgba(13,13,15,1.00)] border-2 border-black transition-all duration-200 ease-in-out transform hover:scale-105 hover:rotate-1">
        <FaArrowUpLong className="w-5 h-5" />
      </div>
    </div>
  );
}
