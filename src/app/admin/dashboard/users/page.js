import Button from "../../../components/Button";

export default async function Users() {
  let items = [];
  
  // Fetch data from API
  const response = await fetch(`${process.env.API_URL}/api/items`);
  if (response.ok) {
    const itemsJson = await response.json();
    if (itemsJson && itemsJson.length > 0) items = itemsJson;
    console.log(items);
  }

  return (
    <>
      <table className="w-full mt-8 text-sm font-body rounded-[20px] border-collapse border border-gray-300">
        <thead>
          <tr className="bg-bone text-gray-700">
            <th className="py-2 px-4 text-left">Title</th>
            <th className="py-2 px-4 text-left">Access</th>
            <th className="py-2 px-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="py-2 px-4">{item.title}</td>
              <td className="py-2 px-4">{item.access}</td>
              <td className="py-2 px-4 text-center">
                <Button text="Delete" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
