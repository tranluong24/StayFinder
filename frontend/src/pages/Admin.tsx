import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { FaHome, FaUsers, FaCog} from "react-icons/fa";
import * as apiClient from '../api-client'
import { UserType } from "../../../backend/src/shared/types";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ClipLoader } from "react-spinners";



const AdminPage = () => {

  type StatusType = "reject" | "pending" | "done";

  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [editedStatus, setEditedStatus] = useState<StatusType | null>(null);
  const queryClient = useQueryClient();

  // Fetch users
  const {
    data: users,
    isLoading,
    error,
  } = useQuery("users", () => apiClient.fetchUsers());

  const { mutate } = useMutation(apiClient.deleteUser, {
    onSuccess: () => {
      console.log("Xoa thanh cong");
      queryClient.invalidateQueries("users"); // Làm mới dữ liệu
    },
    onError: () => {
      console.log("Xoa khong thanh cong");
    }
  });

  const {mutate: mutateDelHotelByUser} = useMutation(apiClient.deleteHotelByIdUser,{
    onSuccess: () => {
      console.log("Delete successfully");
    },
    onError: () => {
      console.log("Delete Failed");
    }
  })

  const { mutate: updateStatus } = useMutation(apiClient.updateUserStatus, {
    onSuccess: () => {
      console.log("Status updated successfully");
      queryClient.invalidateQueries("users");
    },
    onError: () => {
      console.log("Status update failed");
    }
  });

  // Handlers
  const handleDelete = (id: string) => {
    mutate(id);
  };

  const handleDeleteConfirm = (id: string) => {
    confirmAlert({
      title: "Xác nhận xóa",
      message: "Bạn có chắc chắn muốn xóa người dùng này không?",
      buttons: [
        {
          label: "Có",
          onClick: () => {
            handleDelete(id)
            mutateDelHotelByUser(id)
          },
        },
        {
          label: "Không"
        },
      ],
    });
  };

  const handleSaveStatus = (user: UserType) => {
    let statusUpdate = editedStatus || user.status; 
    if(statusUpdate === 'reject'){
      if(user.role === 'host'){
        mutateDelHotelByUser(user._id)
      }
      user.role = 'user'
      statusUpdate = "done"
    }

    if (selectedUser?._id === user._id) {
      updateStatus({ ...user, status: statusUpdate });
      setSelectedUser(null); // Dừng việc chỉnh sửa khi đã lưu
      setEditedStatus(null); // Reset edited status
    }
  };

  const handleSaveStatusConfirm = (user: UserType) => {
    const statusUpdate = editedStatus || user.status;
    confirmAlert({
      title: "Xác nhận cập nhật",
      message: `Bạn có chắc chắn muốn cập nhật trạng thái thành "${statusUpdate}"?`,
      buttons: [
        {
          label: "Có",
          onClick: () => handleSaveStatus(user),
        },
        {
          label: "Không",
          onClick: () => setSelectedUser(null),
        },
      ],
    });
  };
  

  if (isLoading)
    return (
      <div className="loading-spinner">
        <ClipLoader color="#3498db" loading={true} size={50} />
      </div>
    ); 
  if (error) {
    return <div>Lỗi tải trang Admin</div>;}

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/6 bg-blue-600 text-white p-4">
        <div className="mb-6 flex flex-col items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/6858/6858504.png"
            alt="Admin Avatar"
            className="w-20 h-20 rounded-full border-4 border-gray-600"
          />
          <h3 className="mt-2 text-lg font-bold text-center">Chào mừng bạn đến trang Admin</h3>
        </div>
        <ul>
          <li className="mb-2 flex items-center gap-2">
            <FaHome />
            <a href="/" className="block py-2 px-4 rounded hover:bg-gray-700">
              Trang chủ
            </a>
          </li>
          <li className="mb-2 flex items-center gap-2">
            <FaUsers />
            <a href="/admin" className="block py-2 px-4 rounded hover:bg-gray-700">
              Users
            </a>
          </li>
          <li className="mb-2 flex items-center gap-2">
            <FaCog />
            <a href="/admin" className="block py-2 px-4 rounded hover:bg-gray-700">
              Cài đặt
            </a>
          </li>
        </ul>

        {/* <div className="mt-auto flex items-center gap-2 h-full">
            <TbLogout2 />
            <a href="/admin" className="block py-2 px-4 rounded bg-red-500 hover:bg-red-700">
                Log Out
            </a>
        </div> */}

      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6">
        <h1 className="text-3xl font-bold mb-6">BookingWeb.com</h1>

        {/* Table */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Họ và tên đệm</th>
              <th className="border border-gray-300 p-2">Tên</th>
              <th className="border border-gray-300 p-2">Vai trò</th>
              <th className="border border-gray-300 p-2">Trạng thái</th>
              <th className="border border-gray-300 p-2">Tùy chọn</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user: UserType) => (
              <tr key={user._id}>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">{user.firstName}</td>
                <td className="border border-gray-300 p-2">{user.lastName}</td>
                <td className="border border-gray-300 p-2">{user.role}</td>
                <td className="border border-gray-300 p-2 ">
                  {/* Dropdown for status */}
                  {selectedUser?._id === user._id ? (
                    <>
                      <select
                        value={editedStatus || user.status}
                        onChange={(e) => setEditedStatus(e.target.value as StatusType)}
                        className={`p-3 rounded font-bold ${editedStatus === 'reject' ? 'text-red-500' : editedStatus === 'pending' ? 'text-yellow-500' : editedStatus === 'done' ? 'text-green-500' : ''}`}
                      >
                        <option className = "font-bold text-red-500" value="reject">Từ chối</option>
                        <option className = "font-bold text-yellow-500" value="pending">Chưa giải quyết</option>
                        <option className = "font-bold text-green-500" value="done">Duyệt</option>
                      </select>
                      <button
                        onClick={() => handleSaveStatusConfirm(user)}
                        className="ml-2 bg-blue-500 text-white py-1 px-2 rounded"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <span className = {` font-bold ${user.status === 'reject' ? 'text-red-500' : user.status === 'pending' ? 'text-yellow-500' : user.status === 'done' ? 'text-green-500' : ''}`}>{user.status}</span>
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleDeleteConfirm(user._id)}
                    className="bg-red-500 text-white py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="ml-2 bg-yellow-500 text-white py-1 px-2 rounded"
                  >
                    Edit Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
