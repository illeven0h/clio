
// import { collection, getDocs } from "firebase/firestore"; // Import Firestore methods
// import { initializeFirebase } from "/firebase/initFirebase"; // Import Firebase initialization
// import Button from "../../../components/Button";

// export default async function Users() {
//   let users = [];

//   // Initialize Firestore
//   const { firestore } = initializeFirebase();

//   try {
//     // Fetch users collection from Firestore
//     const querySnapshot = await getDocs(collection(firestore, "users"));
//     users = querySnapshot.docs.map((doc) => ({
//       id: doc.id, // Document ID
//       ...doc.data(), // Spread the document data
//     }));
//     console.log(users); // Log the fetched users for debugging
//   } catch (error) {
//     console.error("Error fetching users: ", error);
//   }


//   return (
//     <>
//       <h4 className="text-center text-bone m-4 text-[20px]">Manage Users</h4>
//       <table className="w-full mt-8 text-sm font-body rounded-[20px] border-collapse border border-gray-300">
//         <thead>
//           <tr className="bg-bone text-gray-700">
//             <th className="py-2 px-4 text-left">Username</th>
//             <th className="py-2 px-4 text-left">Email</th>
//             <th className="py-2 px-4 text-left">Role</th>
//             <th className="py-2 px-4 text-left">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.length === 0 ? (
//             <tr>
//               <td colSpan="4" className="text-center py-4">
//                 No users available.
//               </td>
//             </tr>
//           ) : (
//             users.map((user) => (
//               <tr key={user.id} className="border-t">
//                 <td className="py-2 px-4">{user.username}</td>
//                 <td className="py-2 px-4">{user.email}</td>
//                 <td className="py-2 px-4">{user.role}</td>
//                 <td className="py-2 px-4 text-center">
//                   <Button text="Delete" />
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </>
//   );
// }
