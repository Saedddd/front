// components/OwnerCard.tsx
"use client";
import { useState } from "react";
import { deleteOwner } from "@/lib/api";

import { TextField, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

interface Owner {
  id: number;
  name: string;
  email?: string;
}

interface Props {
  owner: Owner;
  onUpdated: () => void;
  onDeleted: () => void;
}

export default function OwnerCard({ owner, onUpdated, onDeleted }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(owner.name);
  const [email, setEmail] = useState(owner.email || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      setEditing(false);
      onUpdated();
    } catch (err) {
      console.error(err);
      alert("Ошибка при обновлении владельца");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Удалить владельца?")) return;
    try {
      setLoading(true);
      await deleteOwner(owner.id);
      onDeleted();
    } catch (err) {
      console.error(err);
      alert("Ошибка при удалении владельца");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-2xl border border-gray-200">
      {editing ? (
        <div className="space-y-2">
          <TextField
            label="Имя владельца"
            value={name}
            onChange={e => setName(e.target.value)}
            size="small"
            fullWidth
          />

          <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} size="small" fullWidth />

          <div className="flex gap-2 mt-2">
            <Button
              variant="contained"
              color="success"
              onClick={handleUpdate}
              disabled={loading}
              startIcon={<SaveIcon />}
            >
              {loading ? "Сохранение..." : "Сохранить"}
            </Button>

            <Button variant="outlined" color="inherit" onClick={() => setEditing(false)} startIcon={<CloseIcon />}>
              Отмена
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold">{owner.name}</h3>

          {owner.email && <p className="text-sm text-gray-500">{owner.email}</p>}

          <p className="text-xs text-gray-400">ID: {owner.id}</p>

          <div className="flex gap-2 mt-3">
            <IconButton color="error" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
}
