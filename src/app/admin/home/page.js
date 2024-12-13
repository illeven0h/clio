
import Image from "next/image"
import Link from "next/link"
import Nav from "@/app/components/Nav";
import Button from "@/app/components/Button";
import AdminNav from "@/app/components/AdminNav";
export default function AdminHomePage() {
    return (
        <>
        <AdminNav />
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
        <Link href="/admin/home">
          <h4 className="text-3xl cursor-pointer text-black">Clio</h4>
        </Link>
      </div>
        </div>


        </>
    );
}