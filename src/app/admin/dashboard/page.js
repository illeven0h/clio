
import Image from "next/image"
import Link from "next/link"
export default function Dashboard() {
    return (
        <>
        <h4 className="mt-8">Dashboard</h4>
        <div className=" flex gap-4" >
            <div className="mt-8 rounded-xl w-max p-8 border-2 ">
                <div className="flex flex-col">
                    <h4>Total users</h4>
                    <h1 >10,000</h1>
                    <p className="text-gray-500 text-[12px]">12% more than previous year</p>
                </div>
            </div>

            <div className="mt-8 rounded-xl w-max p-8 border-2 ">
                <div className="flex flex-col">
                    <h4>Total users</h4>
                    <h1 >10,000</h1>
                    <p className="text-gray-500 text-[12px]">12% more than previous year</p>
                </div>
            </div>

            <div className="mt-8 rounded-xl w-max p-8 border-2 ">
                <div className="flex flex-col">
                    <h4>Total users</h4>
                    <h1 >10,000</h1>
                    <p className="text-gray-500 text-[12px]">12% more than previous year</p>
                </div>
            </div>
        </div>

        <div className="mt-8 rounded-xl w-max p-8 border-2 ">
                <div className="flex flex-col">
                    <h4 className="mb-4">Weekly Recap</h4>
                    <Image 
                        className="border-2 rounded-2xl "
                        src="/images/visualization.png" // Image path
                        alt="Visualization"
                        width={500} // Specify a width (in pixels) or use natural width
                        height={300} // Specify a height (in pixels) or use natural height
                        layout="intrinsic" // Ensures the image keeps its original aspect ratio
                    />
                    
                </div>
            </div>
            
        </>
    );
}