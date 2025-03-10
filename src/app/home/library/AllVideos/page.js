import Image from "next/image";

export default function AllVideos() {
  return (
    <div className="mt-40 flex flex-col items-center justify-center">
      <Image src="/images/noVideos.svg" width={220} height={132} alt="no videos img" />
      <h4 className="text-grey w-2/4 text-center mt-2">
        No Videos. To create videos, visit Explore for inspiration.
      </h4>
    </div>
  );
}
