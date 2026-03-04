"use client";

import { useState, useEffect, useCallback } from "react";

export default function useService() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/services", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createService = async (serviceData) => {
    await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(serviceData),
    });

    fetchServices();
  };

  const deleteService = async (id) => {
    await fetch(`/api/services?id=${id}`, {
      method: "DELETE",
    });

    fetchServices();
  };

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
    loading,
    error,
    fetchServices,
    createService,
    deleteService,
  };
}
