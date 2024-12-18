"use client"
import Button from "../../../components/Button"
import Link from "next/link"
import { useAuth } from "/firebase/auth";
import { useRouter } from "next/navigation";
export default function Profile() {
     const { logout } = useAuth();
        const router = useRouter();
    
        const handleLogout = async () => {
            try {
                await logout(); // Sign out from Firebase
                console.log('User logged out');
                router.push('/'); // Redirect to the landing page
            } catch (error) {
                console.error('Error logging out: ', error);
            }
        };
    return (
        <>
        <div className="flex flex-col w-max items-center ">
        <h5 className="text-center mb-4 text-bone text-[24px] mt-8">Profile</h5>
        <Button onClick= {handleLogout} text = "Logout" />
        </div>
        </>
    );
}