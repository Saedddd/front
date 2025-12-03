/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { updateCar, deleteCar } from "@/lib/api";

import { Button, TextField, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

export default function CarCard({
  car,
  onUpdated,
  onDeleted,
}: {
  car: any;
  onUpdated: () => void;
  onDeleted: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [brand, setBrand] = useState(car.brand);
  const [model, setModel] = useState(car.model || "");
  const [year, setYear] = useState(car.year || "");
  const [ownerId, setOwnerId] = useState(car.ownerId || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updateCar(car.id, { brand, model, year: Number(year), ownerId: Number(ownerId) });
      setEditing(false);
      onUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Удалить машину?")) return;
    try {
      setLoading(true);
      await deleteCar(car.id);
      onDeleted();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-2xl border border-gray-200 flex flex-col gap-2">
      {editing ? (
        <>
          <TextField label="Brand" value={brand} onChange={e => setBrand(e.target.value)} size="small" fullWidth />
          <TextField label="Model" value={model} onChange={e => setModel(e.target.value)} size="small" fullWidth />
          <TextField
            label="Year"
            type="number"
            value={year}
            onChange={e => setYear(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Owner ID"
            type="number"
            value={ownerId}
            onChange={e => setOwnerId(e.target.value)}
            size="small"
            fullWidth
          />

          <div className="flex gap-2 mt-2">
            <Button
              variant="contained"
              color="success"
              onClick={handleUpdate}
              disabled={loading}
              startIcon={<SaveIcon />}
            >
              Save
            </Button>
            <Button variant="outlined" color="inherit" onClick={() => setEditing(false)} startIcon={<CloseIcon />}>
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-indigo-700">{car.brand}</h3>
          <p className="text-sm text-gray-600">Model: {car.model || "—"}</p>
          <p className="text-sm text-gray-600">Year: {car.year || "—"}</p>
          <p className="text-sm text-gray-600">Owner ID: {car.ownerId || "—"}</p>

          <div className="flex gap-2 mt-3">
            <IconButton color="error" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </div>
        </>
      )}
    </div>
  );
}
