"use client";

import { useState, useEffect, useCallback } from "react";

export default function useTours() {
  // Store the data and general loading/error states
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Separate loading states for better UI (e.g., showing a spinner on a "Save" button)
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- FETCH TOURS ---
  const fetchTours = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Clear any old errors

      const res = await fetch("/api/tours", {
        cache: "no-store", // Ensures we get fresh data, bypassing Next.js cache
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch tours");

      // CRITICAL FIX: Ensure the data is actually an array before setting it.
      // This prevents the "tours.map is not a function" error in your dropdown.
      setTours(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Fetch tours error:", err);
      setError(err.message);
      setTours([]); // Fallback to an empty array so UI doesn't break
    } finally {
      setLoading(false);
    }
  }, []);

  // --- CREATE TOUR ---
  const createTour = async (tourData) => {
    try {
      setIsCreating(true);
      setError(null);

      const res = await fetch("/api/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tourData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create tour");

      await fetchTours(); // Refresh the list after successful creation

      return { success: true, data }; // Return success so UI can close modals/show toasts
    } catch (err) {
      console.error("Create tour error:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsCreating(false);
    }
  };

  // --- DELETE TOUR ---
  const deleteTour = async (id) => {
    try {
      setIsDeleting(true);
      setError(null);

      const res = await fetch(`/api/tours?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete tour");

      await fetchTours(); // Refresh the list

      return { success: true };
    } catch (err) {
      console.error("Delete tour error:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsDeleting(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  return {
    tours,
    loading,
    error,
    isCreating,
    isDeleting,
    fetchTours,
    createTour,
    deleteTour,
  };
}
