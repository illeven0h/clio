"use client";
import { useAuth } from "../../../../firebase/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser === undefined) return;
    if (!currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);

  if (currentUser === undefined) {
    return (
      <div className="flex justify-center items-center h-screen text-orange">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#fefae0]">
      <div className="flex-1 overflow-y-auto p-6 bg-[#fefae0]">
        <p className="text-gray-500 text-center mt-20">Chat responses will appear here...</p>
      </div>

      <div className="p-4 border-t border-gray-300 bg-[#fefae0] flex items-center justify-between">
        <input
          type="text"
          placeholder="Describe your ad..."
          className="w-full p-3 rounded-full border border-gray-300 focus:outline-none"
        />
        <button className="ml-4 px-4 py-2 rounded-full bg-lime-300 text-black hover:bg-lime-400 shadow">
          Send
        </button>
      </div>
    </div>
  );
}
