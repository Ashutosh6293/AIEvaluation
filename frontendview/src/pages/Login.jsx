import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../api";

// const API_URL = import.meta.env.VITE_API_URL;



export default function Login() {
  const [mode, setMode] = useState("employee"); // "employee" or "admin"
  const [punch_no, setPunchNo] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [area, setArea] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const navigate = useNavigate();

  // console.log(API);

  // 🧑‍🏭 Employee Login/Register
  const handleRegisterAndStart = async () => {
    if (!punch_no || !name || !area || !department) {
      alert("⚠️ Please fill all fields");
      return;
    }

    try {
      const res = await API.post(`/employees/`, {
        punch_no,
        name,
        department,
        area,
      });

      if (res.status === 201 || res.status === 200) {
        navigate(
          `/assessment?punch_no=${punch_no}&department=${department}&area=${area}&name=${name}`
        );
      } else {
        alert("❌ Failed to register employee.");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error registering employee (maybe already exists).");
    }
  };

  // 🔐 Admin Login
  const handleAdminLogin = () => {
    if (adminUsername === "admin" && adminPassword === "D120121") {
      alert("✅ Welcome Admin!");
      navigate("/dashboard");
    } else {
      alert("❌ Invalid Admin Credentials");
    }
  };

  return (
    <div className="flex items-center justify-center w-[100vw] h-screen bg-gradient-to-r from-gray-900 to-gray-700">
      <div className="bg-gray-800  rounded-3xl shadow-2xl p-2 w-full max-w-lg border border-white">
        {/* 🔝 Toggle Buttons */}
        <div className="flex justify-center py-2 gap-4 border-b border-gray-600">
          <button
            onClick={() => setMode("employee")}
            className={`font-semibold text-lg transition-all duration-300 ${mode === "employee"
                ? "text-blue-400 border-b-4 border-blue-400"
                : "text-gray-400 hover:text-dark"
              }`}
          >
            Employee Login
          </button>
          <button
            onClick={() => setMode("admin")}
            className={`font-semibold text-lg transition-all duration-300 ${mode === "admin"
                ? "text-blue-400 border-b-4 border-blue-400"
                : "text-gray-400 hover:text-dark"
              }`}
          >
            Admin Login
          </button>
        </div>

        {mode === "admin" ? (
          // 🔐 Admin Login Form
          <>
            <div className="mb-4 mt-2">
              <label className="block text-gray-300 font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter Admin Username"
                name="admin_username"
                autoComplete="off"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full px-5 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div className="mb-8">
              <label className="block text-gray-300 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="admin_password"
                autoComplete="new-password"
                placeholder="Enter Admin Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-5 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <button
              onClick={handleAdminLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-dark font-bold py-3 px-6 rounded-xl transition duration-300 shadow-lg"
            >
              🔐 Login as Admin
            </button>
          </>
        ) : (
          // 👷 Employee Login Form
          <>
            <div className="mb-4 mt-2">
              <label className="block text-gray-300 font-medium mb-2">
                Employee Punch No.
              </label>
              <input
                type="text"
                placeholder="Enter Punch No."
                autoComplete="off"
                value={punch_no}
                onChange={(e) => setPunchNo(e.target.value)}
                className="w-full px-5 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 font-medium mb-2">Name</label>
              <input
                type="text"
                placeholder="Enter Name"
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 font-medium mb-2">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-5 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
              >
                <option value="">Select Department</option>
                <option value="Production">Production</option>
                <option value="Quality">Quality</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Store">Store</option>
                <option value="PPC">PPC</option>
                <option value="HR">HR</option>
                <option value="EHS">EHS</option>
                <option value="Packaging">Packaging</option>
                <option value="Dispatch">Dispatch</option>
              </select>
            </div>

            <div className="mb-8">
              <label className="block text-gray-300 font-medium mb-2">
                Work Area
              </label>
              <input
                type="text"
                placeholder="e.g. Stringer Operator, EL Operator"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-5 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <button
              onClick={handleRegisterAndStart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-dark font-bold py-3 px-6 rounded-xl transition duration-300 shadow-lg"
            >
              🚀 Start Assessment
            </button>
          </>
        )}
      </div>
    </div>
  );
}





// // import React, { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";

// // const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// // export default function Login() {
// //   const [mode, setMode] = useState("admin"); // default = admin first
// //   const [punch_no, setPunchNo] = useState("");
// //   const [name, setName] = useState("");
// //   const [department, setDepartment] = useState("");
// //   const [area, setArea] = useState("");
// //   const [adminUsername, setAdminUsername] = useState("");
// //   const [adminPassword, setAdminPassword] = useState("");
// //   const navigate = useNavigate();

// //   // 🧑‍🏭 Employee Login/Register
// //   const handleRegisterAndStart = async () => {
// //     if (!punch_no || !name || !area || !department) {
// //       alert("⚠️ Please fill all fields");
// //       return;
// //     }

// //     try {
// //       const res = await axios.post(`${API_URL}/employees/`, {
// //         punch_no,
// //         name,
// //         department,
// //         area,
// //       });

// //       if (res.status === 201 || res.status === 200) {
// //         navigate(
// //           `/assessment?punch_no=${punch_no}&department=${department}&area=${area}&name=${name}`
// //         );
// //       } else {
// //         alert("❌ Failed to register employee.");
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       alert("⚠️ Error registering employee (maybe already exists).");
// //     }
// //   };

// //   // 🔐 Admin Login
// //   const handleAdminLogin = () => {
// //     if (adminUsername === "admin" && adminPassword === "D120121") {
// //       alert("✅ Welcome Admin!");
// //       navigate("/dashboard");
// //     } else {
// //       alert("❌ Invalid Admin Credentials");
// //     }
// //   };

// //   return (
// //     <div className="flex items-center justify-center w-[100vw] h-screen bg-gradient-to-r from-gray-900 to-gray-700">
// //       <div className="bg-gray-800 rounded-3xl shadow-2xl p-6 w-full max-w-lg border border-white">
// //         {/* 🔝 Toggle Buttons */}
// //         <div className="flex justify-center py-2 gap-4 border-b border-gray-600 mb-6">
// //           <button
// //             onClick={() => setMode("admin")}
// //             className={`font-semibold text-lg transition-all duration-300 ${
// //               mode === "admin"
// //                 ? "text-blue-400 border-b-4 border-blue-400"
// //                 : "text-gray-400 hover:text-gray-200"
// //             }`}
// //           >
// //             Admin Login
// //           </button>
// //           <button
// //             onClick={() => setMode("employee")}
// //             className={`font-semibold text-lg transition-all duration-300 ${
// //               mode === "employee"
// //                 ? "text-blue-400 border-b-4 border-blue-400"
// //                 : "text-gray-400 hover:text-gray-200"
// //             }`}
// //           >
// //             Employee Login
// //           </button>
// //         </div>

// //         {mode === "admin" ? (
// //           // 🔐 Admin Login Form
// //           <>
// //             <div className="mb-4 mt-2">
// //               <label className="block text-gray-300 font-medium mb-2">
// //                 Username
// //               </label>
// //               <input
// //                 type="text"
// //                 name="admin_username"
// //                 autoComplete="off"
// //                 placeholder="Enter Admin Username"
// //                 value={adminUsername}
// //                 onChange={(e) => setAdminUsername(e.target.value)}
// //                 className="w-full px-5 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
// //               />
// //             </div>

// //             <div className="mb-8">
// //               <label className="block text-gray-300 font-medium mb-2">
// //                 Password
// //               </label>
// //               <input
// //                 type="password"
// //                 name="admin_password"
// //                 autoComplete="new-password"
// //                 placeholder="Enter Admin Password"
// //                 value={adminPassword}
// //                 onChange={(e) => setAdminPassword(e.target.value)}
// //                 className="w-full px-5 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
// //               />
// //             </div>

// //             <button
// //               onClick={handleAdminLogin}
// //               className="w-full bg-blue-600 hover:bg-blue-700 text-dark font-bold py-3 px-6 rounded-xl transition duration-300 shadow-lg"
// //             >
// //               🔐 Login as Admin
// //             </button>
// //           </>
// //         ) : (
// //           // 👷 Employee Login Form
// //           <>
// //             <div className="mb-4 mt-2">
// //               <label className="block text-gray-300 font-medium mb-2">
// //                 Employee Punch No.
// //               </label>
// //               <input
// //                 type="text"
// //                 name="employee_punch"
// //                 autoComplete="off"
// //                 placeholder="Enter Punch No."
// //                 value={punch_no}
// //                 onChange={(e) => setPunchNo(e.target.value)}
// //                 className="w-full px-5 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
// //               />
// //             </div>

// //             <div className="mb-4">
// //               <label className="block text-gray-300 font-medium mb-2">Name</label>
// //               <input
// //                 type="text"
// //                 name="employee_name"
// //                 autoComplete="off"
// //                 placeholder="Enter Name"
// //                 value={name}
// //                 onChange={(e) => setName(e.target.value)}
// //                 className="w-full px-5 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
// //               />
// //             </div>

// //             <div className="mb-4">
// //               <label className="block text-gray-300 font-medium mb-2">
// //                 Department
// //               </label>
// //               <select
// //                 value={department}
// //                 onChange={(e) => setDepartment(e.target.value)}
// //                 className="w-full px-5 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
// //               >
// //                 <option value="">Select Department</option>
// //                 <option value="Production">Production</option>
// //                 <option value="Quality">Quality</option>
// //                 <option value="Maintenance">Maintenance</option>
// //                 <option value="Store">Store</option>
// //                 <option value="PPC">PPC</option>
// //                 <option value="HR">HR</option>
// //                 <option value="Packaging">Packaging</option>
// //                 <option value="Dispatch">Dispatch</option>
// //               </select>
// //             </div>

// //             <div className="mb-8">
// //               <label className="block text-gray-300 font-medium mb-2">
// //                 Work Area
// //               </label>
// //               <input
// //                 type="text"
// //                 name="employee_area"
// //                 autoComplete="off"
// //                 placeholder="e.g. Stringer Operator, EL Operator"
// //                 value={area}
// //                 onChange={(e) => setArea(e.target.value)}
// //                 className="w-full px-5 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
// //               />
// //             </div>

// //             <button
// //               onClick={handleRegisterAndStart}
// //               className="w-full bg-blue-600 hover:bg-blue-700 text-dark font-bold py-3 px-6 rounded-xl transition duration-300 shadow-lg"
// //             >
// //               🚀 Start Assessment
// //             </button>
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }





// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// export default function Login() {
//   const [isAdminLogin, setIsAdminLogin] = useState(false);

//   // ✅ Separate states for employee and admin to avoid autofill issue
//   const [employeeData, setEmployeeData] = useState({
//     punch_no: "",
//     name: "",
//     department: "",
//     area: "",
//   });

//   const [adminData, setAdminData] = useState({
//     username: "",
//     password: "",
//   });

//   const navigate = useNavigate();

//   // ✅ Employee Register
//   const handleRegisterAndStart = async () => {
//     const { punch_no, name, department, area } = employeeData;

//     if (!punch_no || !name || !area || !department) {
//       alert("⚠️ Please fill all fields");
//       return;
//     }

//     try {
//       const res = await axios.post(`${API_URL}/employees/`, {
//         punch_no,
//         name,
//         department,
//         area,
//       });

//       if (res.status === 201 || res.status === 200) {
//         navigate(
//           `/assessment?punch_no=${punch_no}&department=${department}&area=${area}&name=${name}`
//         );
//       } else {
//         alert("❌ Failed to register employee.");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("⚠️ Error registering employee (maybe already exists).");
//     }
//   };

//   // ✅ Admin Login
//   const handleAdminLogin = () => {
//     const { username, password } = adminData;
//     if (username === "admin" && password === "D120121") {
//       navigate("/dashboard");
//     } else {
//       alert("❌ Invalid admin credentials!");
//     }
//   };

//   return (
//     <div
//       className="flex items-center justify-center w-full h-screen bg-gradient-to-r from-gray-900 to-gray-700 px-4"
//       style={{ width: "100vw", height: "100vh" }}
//     >
//       <div className="bg-gray-800 text-white rounded-3xl shadow-2xl p-10 w-full max-w-lg">
//         {/* Toggle between Admin and Employee */}
//         <div className="flex justify-center mb-8 space-x-4">
//           <button
//             onClick={() => setIsAdminLogin(true)}
//             className={`px-6 py-2 rounded-lg font-semibold ${
//               isAdminLogin ? "bg-gray-700 text-white" : "bg-gray-900 text-gray-400"
//             }`}
//           >
//             Admin Login
//           </button>
//           <button
//             onClick={() => setIsAdminLogin(false)}
//             className={`px-6 py-2 rounded-lg font-semibold ${
//               !isAdminLogin ? "bg-gray-700 text-white" : "bg-gray-900 text-gray-400"
//             }`}
//           >
//             Employee Login
//           </button>
//         </div>

//         <hr className="border-gray-700 mb-6" />

//         {/* ✅ Admin Login Form */}
//         {isAdminLogin ? (
//           <>
//             <div className="mb-5">
//               <label className="block text-gray-300 font-medium mb-2">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter Username"
//                 value={adminData.username}
//                 onChange={(e) =>
//                   setAdminData({ ...adminData, username: e.target.value })
//                 }
//                 className="w-full px-5 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//               />
//             </div>

//             <div className="mb-8">
//               <label className="block text-gray-300 font-medium mb-2">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 placeholder="Enter Password"
//                 value={adminData.password}
//                 onChange={(e) =>
//                   setAdminData({ ...adminData, password: e.target.value })
//                 }
//                 className="w-full px-5 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//               />
//             </div>

//             <button
//               onClick={handleAdminLogin}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-dark font-bold py-3 px-6 rounded-xl transition duration-300 shadow-lg"
//             >
//               🔐 Login as Admin
//             </button>
//           </>
//         ) : (
//           <>
//             {/* ✅ Employee Login Form (same UI, no change) */}
//             <div className="mb-5">
//               <label className="block text-gray-300 font-medium mb-2">
//                 Employee Punch No.
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter Punch No."
//                 value={employeeData.punch_no}
//                 onChange={(e) =>
//                   setEmployeeData({ ...employeeData, punch_no: e.target.value })
//                 }
//                 className="w-full px-5 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//               />
//             </div>

//             <div className="mb-5">
//               <label className="block text-gray-300 font-medium mb-2">
//                 Name
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter Name"
//                 value={employeeData.name}
//                 onChange={(e) =>
//                   setEmployeeData({ ...employeeData, name: e.target.value })
//                 }
//                 className="w-full px-5 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//               />
//             </div>

//             <div className="mb-5">
//               <label className="block text-gray-300 font-medium mb-2">
//                 Department
//               </label>
//               <select
//                 value={employeeData.department}
//                 onChange={(e) =>
//                   setEmployeeData({
//                     ...employeeData,
//                     department: e.target.value,
//                   })
//                 }
//                 className="w-full px-5 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
//               >
//                 <option value="">Select Department</option>
//                 <option value="Production">Production</option>
//                 <option value="Quality">Quality</option>
//                 <option value="Maintenance">Maintenance</option>
//                 <option value="Store">Store</option>
//                 <option value="PPC">PPC</option>
//                 <option value="HR">HR</option>
//                 <option value="Packaging">Packaging</option>
//                 <option value="Dispatch">Dispatch</option>
//               </select>
//             </div>

//             <div className="mb-8">
//               <label className="block text-gray-300 font-medium mb-2">
//                 Work Location
//               </label>
//               <input
//                 type="text"
//                 placeholder="e.g. Stringer Operator, EL Operator"
//                 value={employeeData.area}
//                 onChange={(e) =>
//                   setEmployeeData({ ...employeeData, area: e.target.value })
//                 }
//                 className="w-full px-5 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//               />
//             </div>

//             <button
//               onClick={handleRegisterAndStart}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-dark font-bold py-3 px-6 rounded-xl transition duration-300 shadow-lg"
//             >
//               🚀 Start Assessment
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
