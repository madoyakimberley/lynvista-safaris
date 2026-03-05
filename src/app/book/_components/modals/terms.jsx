"use client";

export default function Terms({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="booking-title mb-4">Terms & Conditions</h2>

        <p>
          By booking this flight you agree to the airline cancellation and
          refund policies.
        </p>

        <button className="submit-btn mt-6" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
