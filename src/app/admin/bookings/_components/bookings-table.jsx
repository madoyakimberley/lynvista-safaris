"use client";

import { useState } from "react";

export default function BookingsTable({
  bookings = [],
  markPaid,
  deleteBooking,
  sendPaymentLink,
  sentQuotations,
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [quoteItems, setQuoteItems] = useState([{ name: "", price: "" }]);
  const [currency, setCurrency] = useState("KES");
  const [paymentMethod, setPaymentMethod] = useState("Paystack");

  function openQuoteModal(booking) {
    setSelectedBooking(booking);
    setQuoteItems([{ name: "", price: "" }]);
    setShowModal(true);
  }

  function addQuoteItem() {
    setQuoteItems([...quoteItems, { name: "", price: "" }]);
  }

  function updateQuoteItem(index, field, value) {
    const updated = [...quoteItems];
    updated[index][field] = value;
    setQuoteItems(updated);
  }

  function removeQuoteItem(index) {
    setQuoteItems(quoteItems.filter((_, i) => i !== index));
  }

  const totalPrice = quoteItems.reduce(
    (acc, item) => acc + (parseFloat(item.price) || 0),
    0,
  );

  async function handleSubmit() {
    if (!selectedBooking) return;

    await sendPaymentLink(
      selectedBooking.id,
      totalPrice,
      quoteItems,
      selectedBooking.email,
      paymentMethod,
      currency,
    );

    setShowModal(false);
  }

  return (
    <div className="text-[#2d1b0b]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-[13px] font-bold uppercase border-b-2 border-[#2d5016]/20">
            <th className="pb-4 pr-4">Client</th>
            <th className="pb-4 px-4">Tour / Service</th>
            <th className="pb-4 px-4">Price</th>
            <th className="pb-4 px-4 text-center">Method</th>
            <th className="pb-4 px-4 text-center">Status</th>
            <th className="pb-4 pl-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2d1b0b]/10">
          {bookings.map((b) => {
            const isSent =
              sentQuotations[b.id] || b.payment_status === "Quotation Sent";

            return (
              <tr
                key={b.id}
                className="text-sm hover:bg-[#2d5016]/5 transition"
              >
                <td className="py-5 pr-4 font-bold">{b.full_name}</td>
                <td className="py-5 px-4">
                  {b.service_name || b.tour_package || "—"}
                </td>
                <td className="py-5 px-4">
                  {b.total_price || 0} {b.currency || "KES"}
                </td>
                <td className="py-5 px-4 text-center text-xs">
                  {b.payment_method === "Paystack"
                    ? "Card Payment"
                    : b.payment_method || "—"}
                </td>
                <td className="py-5 px-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      b.payment_status === "Paid"
                        ? "bg-[#2d5016] text-white"
                        : "bg-[#fbbf24] text-[#2d1b0b]"
                    }`}
                  >
                    {b.payment_status}
                  </span>
                </td>
                <td className="py-5 pl-4 text-right flex gap-2 flex-wrap justify-end">
                  <button
                    onClick={() => openQuoteModal(b)}
                    className={`px-4 py-1 rounded-full text-white transition ${
                      isSent ? "bg-[#a16207]" : "bg-[#2d5016]"
                    }`}
                  >
                    {isSent ? "RESEND QUOTE" : "SEND QUOTE"}
                  </button>
                  <button
                    onClick={() => markPaid(b.id)}
                    className="bg-[#2d5016] text-white px-4 py-1 rounded-full hover:bg-[#3e2c1f] transition"
                  >
                    MARK PAID
                  </button>
                  <button
                    onClick={() => deleteBooking(b.id)}
                    className="bg-red-700 text-white px-4 py-1 rounded-full hover:bg-red-800 transition"
                  >
                    DELETE
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#faf8f3] p-8 rounded-xl w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold text-[#2d5016]">
              Create Quotation for {selectedBooking.full_name}
            </h2>

            <div className="flex gap-4 p-2">
              {[
                { label: "Card Payment", value: "Paystack" },
                { label: "M-Pesa", value: "M-Pesa" },
              ].map((method) => (
                <label
                  key={method.value}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-[#2d5016]"
                  />
                  <span className="ml-2 font-medium text-[#2d1b0b]">
                    {method.label}
                  </span>
                </label>
              ))}
            </div>

            {quoteItems.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  placeholder="Item Name"
                  value={item.name}
                  onChange={(e) => updateQuoteItem(i, "name", e.target.value)}
                  className="border p-2 w-full rounded"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => updateQuoteItem(i, "price", e.target.value)}
                  className="border p-2 w-24 rounded"
                />
                <button
                  onClick={() => removeQuoteItem(i)}
                  className="text-red-600 font-bold px-2"
                >
                  X
                </button>
              </div>
            ))}

            <button
              onClick={addQuoteItem}
              className="text-sm text-[#2d5016] font-bold"
            >
              + Add Item
            </button>

            <div className="flex items-center justify-between border-t pt-4">
              <span className="font-bold">Total: {totalPrice.toFixed(2)}</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="border p-1 rounded"
              >
                <option value="KES">KES</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-200 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="w-full bg-[#2d5016] text-white py-2 rounded font-bold"
              >
                Save & Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
