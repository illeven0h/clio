import Sidebar from '@/app/components/admin-dashboard/sidebar';
import Navbar from '@/app/components/admin-dashboard/navbar';
export default function Layout({children}) {
    return (
        <div className="flex">
            <div className='basis-1/5 flex-shrink-0  '>
                <Sidebar />
            </div>

            <div className="basis-4/5 flex-grow mx-12 my-2">
                <Navbar  />
                {children}
            </div>

        </div>
    )
}
