"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/* کمک برای فرمت تاریخ */
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleString("fr-BE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* تاریخ امروز به فرمت YYYY-MM-DD برای هایلایت رزروهای امروز */
function getTodayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function AdminPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // سرچ و فیلتر
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState("all");
  const [filterDate, setFilterDate] = useState(""); // YYYY-MM-DD
  const [sortOrder, setSortOrder] = useState("newest"); // newest | oldest
  const [onlyToday, setOnlyToday] = useState(false);

  const todayKey = getTodayKey();

  /* ========================
     Load data from API
  ======================== */
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/admin/reservations", {
          cache: "no-store",
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Erreur lors du chargement.");
        }

        const list = json.reservations || [];

        // مرتب‌سازی اولیه: جدید به قدیم
        list.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setReservations(list);
      } catch (err) {
        console.error(err);
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /* ========================
     Derived data – services list
  ======================== */
  const serviceOptions = useMemo(() => {
    const set = new Set();
    reservations.forEach((r) => {
      if (r.service_type) set.add(r.service_type);
    });
    return Array.from(set);
  }, [reservations]);

  /* ========================
     Filtering & Searching
  ======================== */
  const filteredReservations = useMemo(() => {
    let list = [...reservations];

    const search = searchTerm.toLowerCase().trim();

    if (search) {
      list = list.filter((r) => {
        const text = (
          (r.full_name || "") +
          " " +
          (r.email || "") +
          " " +
          (r.phone || "") +
          " " +
          (r.license_plate || "") +
          " " +
          (r.service_type || "") +
          " " +
          (r.message || "")
        )
          .toLowerCase()
          .trim();

        return text.includes(search);
      });
    }

    if (filterService !== "all") {
      list = list.filter((r) => r.service_type === filterService);
    }

    if (filterDate) {
      list = list.filter((r) => r.date === filterDate);
    }

    if (onlyToday) {
      list = list.filter((r) => r.date === todayKey);
    }

    // sort
    list.sort((a, b) => {
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? db - da : da - db;
    });

    return list;
  }, [reservations, searchTerm, filterService, filterDate, sortOrder, onlyToday, todayKey]);

  const totalReservations = reservations.length;
  const lastReservation = reservations[0] || null;

  /* ========================
     DELETE handler
  ======================== */
  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer cette réservation ?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/reservations?id=${id}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Erreur lors de la suppression");
      }

      // حذف از state
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message || "Erreur lors de la suppression");
    }
  }

  /* ========================
     Export CSV
  ======================== */
  function handleExportCsv() {
    if (filteredReservations.length === 0) {
      alert("Aucune donnée à exporter.");
      return;
    }

    const header = [
      "id",
      "created_at",
      "date",
      "time",
      "service_type",
      "full_name",
      "phone",
      "email",
      "license_plate",
      "message",
    ];

    const rows = filteredReservations.map((r) => [
      r.id,
      r.created_at,
      r.date,
      r.time,
      r.service_type || "",
      r.full_name || "",
      r.phone || "",
      r.email || "",
      r.license_plate || "",
      (r.message || "").replace(/\n/g, " "),
    ]);

    const csv =
      header.join(";") +
      "\n" +
      rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    const date = new Date().toISOString().slice(0, 10);
    a.download = `reservations-${date}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ========================
     Print
  ======================== */
  function handlePrint() {
    window.print();
  }

  /* ========================
     UI
  ======================== */
  return (
    <div className="admin-wrapper">
      {/* Header */}
      <header className="admin-header">
        <div>
          <h1 className="admin-title">Tableau de bord – Réservations</h1>
          <p className="admin-subtitle">
            Vue interne de toutes les réservations reçues via le formulaire en
            ligne.
          </p>
        </div>

        <div className="admin-header-actions">
          <Link href="/" className="btn btn--outline admin-back-btn">
            ⬅ Retour au site
          </Link>
          <button className="btn btn--outline" onClick={handleExportCsv}>
            📥 Export CSV
          </button>
          <button className="btn btn--outline" onClick={handlePrint}>
            🖨 Imprimer
          </button>
        </div>
      </header>

      {/* Stats */}
      <section className="admin-stats">
        <div className="admin-stat-card">
          <span className="admin-stat-label">Total réservations</span>
          <span className="admin-stat-value">{totalReservations}</span>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-label">Dernière réservation</span>
          <span className="admin-stat-value">
            {lastReservation ? formatDate(lastReservation.created_at) : "—"}
          </span>
        </div>
      </section>

      {/* Filters */}
      <section className="admin-filters">
        <div className="admin-filter-group">
          <label>
            Recherche
            <input
              type="text"
              placeholder="Nom, email, téléphone, plaque..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>

        <div className="admin-filter-group">
          <label>
            Service
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
            >
              <option value="all">Tous</option>
              {serviceOptions.map((srv) => (
                <option key={srv} value={srv}>
                  {srv}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="admin-filter-group">
          <label>
            Jour réservé
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </label>
        </div>

        <div className="admin-filter-group">
          <label>
            Tri
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Plus récent → plus ancien</option>
              <option value="oldest">Plus ancien → plus récent</option>
            </select>
          </label>
        </div>

        <div className="admin-filter-group">
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={onlyToday}
              onChange={(e) => setOnlyToday(e.target.checked)}
            />
            Uniquement aujourd&apos;hui
          </label>
        </div>

        <button
          className="btn btn--outline"
          onClick={() => {
            setSearchTerm("");
            setFilterService("all");
            setFilterDate("");
            setSortOrder("newest");
            setOnlyToday(false);
          }}
        >
          Réinitialiser les filtres
        </button>
      </section>

      {/* Table */}
      <section className="admin-table-card">
        <div className="admin-table-header">
          <h2>Liste des réservations</h2>
          <p>
            Triées de la plus récente à la plus ancienne. Résultats filtrés :{" "}
            <b>{filteredReservations.length}</b>
          </p>
        </div>

        {loading ? (
          <p className="admin-empty">Chargement des réservations...</p>
        ) : error ? (
          <p className="admin-empty" style={{ color: "red" }}>
            {error}
          </p>
        ) : filteredReservations.length === 0 ? (
          <p className="admin-empty">Aucune réservation trouvée.</p>
        ) : (
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date de création</th>
                  <th>Jour réservé</th>
                  <th>Heure</th>
                  <th>Service</th>
                  <th>Nom</th>
                  <th>Téléphone</th>
                  <th>Email</th>
                  <th>Plaque</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredReservations.map((r, index) => {
                  const isToday = r.date === todayKey;
                  return (
                    <tr
                      key={r.id}
                      className={isToday ? "admin-row--today" : ""}
                    >
                      <td>{index + 1}</td>
                      <td>{formatDate(r.created_at)}</td>
                      <td>{r.date}</td>
                      <td>{r.time}</td>
                      <td>
                        <span className="admin-badge">
                          {r.service_type || "—"}
                        </span>
                      </td>
                      <td>{r.full_name || "—"}</td>
                      <td>{r.phone || "—"}</td>
                      <td>{r.email || "—"}</td>
                      <td>{r.license_plate || "—"}</td>
                      <td className="admin-message-cell">
                        {r.message || "—"}
                      </td>
                      <td>
                        <button
                          className="admin-delete-btn"
                          onClick={() => handleDelete(r.id)}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
