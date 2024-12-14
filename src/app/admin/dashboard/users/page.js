import Button from "@/app/components/Button";

export default function Users() {
  return (
    <>
      <table className="w-full mt-8 text-sm font-body rounded-[20px] border-collapse border border-gray-300">
        <thead>
          <tr className="bg-bone  text-gray-700">
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Created At</th>
            <th className="py-2 px-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="py-2 px-4">John Doe</td>
            <td className="py-2 px-4">john.doe@example.com</td>
            <td className="py-2 px-4">12-12-24</td>
            <td className="py-2 px-4 text-center">
              <Button text="Delete" />
            </td>
          </tr>
          <tr className="border-t">
            <td className="py-2 px-4">Jane Smith</td>
            <td className="py-2 px-4">jane.smith@example.com</td>
            <td className="py-2 px-4">12-12-24</td>
            <td className="py-2 px-4 text-center">
              <Button text="Delete" />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
