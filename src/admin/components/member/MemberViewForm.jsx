import React from "react";
import "./MemberViewForm.css";

const MemberViewForm = ({ member, onClose }) => {
  return (
    <div className="view-modal-overlay">
      <div className="view-modal-content">
        <h3>회원 상세 정보</h3>
        
        <div className="view-info">
          <p><strong>ID:</strong> {member.id}</p>
          <p><strong>이름:</strong> {member.name}</p>
          <p><strong>이메일:</strong> {member.email}</p>
          <p><strong>전화번호:</strong> {member.phone}</p>
          <p><strong>가입일:</strong> {member.date}</p>
          <p><strong>직급:</strong> {member.role} ({member.roleDescription})</p>
        </div>

        <div className="view-btn-group">
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default MemberViewForm;
