import React from 'react'
import Image from 'next/image'

const Card = () => {
  return (
    <>
    <div className="w-full sm:w-[280px] md:w-[335px] aspect-[3/4] rounded-[20px] border-2 border-[#e6e4d5] ">
      {/* image */}
    <Image  className="p-3 w-full" src="/rectangle.svg" alt="Sunset in the mountains"   width={500} // Adjust width as per your design
    height={300} />

    {/* video description */}
    <div className ="px-3">
        <p className="text-bone text-body text-[12px]">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
        </p>
    </div>


    <div className='p-3 flex justify-between'>
    {/* profile image and username */}
    <div>
    <span className="flex items-center gap-2">
          <Image 
          src = "/profile.svg"
          width ={40}
          height = {40}
          alt = "heart icon"
          />
          <p className='text-[10px]'>user_name</p>
        </span>
        </div>

    {/* like share and comment */}
    <div >
        <span className="px-1 inline-block">
          <Image 
          src = "/heart.svg"
          width ={24}
          height = {24}
          alt = "heart icon"
          />
          <p className='pt-2 text-[10px]'>20</p>
        </span>
        <span className="px-1 inline-block ">
          <Image 
          src = "/share.svg"
          width ={24}
          height = {24}
          alt = "heart icon"
          />
          <p className='pt-2 text-[10px]'>15</p>
        </span>
        <span className="px-1 inline-block ">
          <Image 
          src = "/comment.svg"
          width ={24}
          height = {24}
          alt = "heart icon"
          />
          <p className='pt-2 text-[10px]'>10</p>
        </span>
    </div>


    </div>
    </div>
    </>
  )
}

export default Card