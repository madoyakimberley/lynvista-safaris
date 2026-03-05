import MainBookingForm from "./_components/forms/main-booking-form";

export default function BookingPage() {
  return (
    <div className="booking-bg min-h-screen flex items-center justify-center p-10">
      <div className="booking-card">
        <MainBookingForm />
      </div>
    </div>
  );
}
