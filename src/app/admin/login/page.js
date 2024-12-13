import Button from "@/app/components/Button";

export default function AdminLoginPage() {
    return (
      <div className="flex flex-col justify-center min-h-screen py-2 bg-black">
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
            <div className="border-2 border-ivory p-12 rounded-3xl">
                <div><h4 className="text-white text-[30px]">Skibidi Admin</h4></div>
                <input className="border-2 text-[12px] bg-black font-body mt-12 text-ivory border-ivory px-4 py-2 w-full rounded-full" type="text"  placeholder="Email Address" />
                <input className="border-2 text-[12px] bg-black mt-4 mb-4 font-body text-ivory border-ivory px-4 py-2 w-full rounded-full" type="password"  placeholder="Password" />
                <div className="flex flex-col gap-3 ">
                  <Button text = "Continue"></Button>
                </div>
            </div>
        </main>

      </div>
    );
}
  