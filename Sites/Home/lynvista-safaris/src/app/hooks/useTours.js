"use client";

import { useState, useEffect, useCallback } from "react";

export default function useTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTours = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/tours", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setTours(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTour = async (tourData) => {
    await fetch("/api/tours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tourData),
    });

    fetchTours();
  };

  const deleteTour = async (id) => {
    await fetch(`/api/tours?id=${id}`, {
      method: "DELETE",
    });

    fetchTours();
  };

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  return {
    tours,
    loading,
    error,
    fetchTours,
    createTour,
    deleteTour,
  };
}
