import React, { useEffect, useState } from "react";
import "./MemberViewForm.css";
import { fetchUserById } from "../../api/users";
import useUserStore from "../../stores/userStore";
import useAuthStore from "../../../stores/authStore";

const MemberViewForm = ({ memberId, onClose }) => {
  const [detail, setDetail] = useState(null);
  const setSelectedUser = useUserStore((state) => state.setSelectedUser);
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const loadUser = async () => {
      const user = await fetchUserById(memberId, accessToken);
      if (user) {
        const formatted = {
          id: user.id,
          name: user.username,
          email: `📧 ${user.email}`,
          phone: user.phone,
          date: user.createdAt ? `🗓️ ${user.createdAt.split(" ")[0].replace(/-/g, ".")}` : "",
          role: user.roleName,
          roleDescription: user.roleDescription,
        };

        setDetail(formatted);
        setSelectedUser(formatted);
      }
    };

    loadUser();
  }, [memberId, accessToken, setSelectedUser]);

  if (!detail) {
    return (
      <div className="view-modal-overlay">
        <div className="view-modal-content">
          로딩 중...
        </div>
      </div>
    );
  }

  return (
    <div className="view-modal-overlay">
      <div className="view-modal-content">
        <h3>회원 상세 정보</h3>
        
        <div className="view-info">
          <p><strong>ID:</strong> {detail.id}</p>
          <p><strong>이름:</strong> {detail.name}</p>
          <p><strong>이메일:</strong> {detail.email}</p>
          <p><strong>전화번호:</strong> {detail.phone}</p>
          <p><strong>가입일:</strong> {detail.date}</p>
          <p><strong>직급:</strong> {detail.role} ({detail.roleDescription})</p>
        </div>

        <div className="view-btn-group">
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default MemberViewForm;
