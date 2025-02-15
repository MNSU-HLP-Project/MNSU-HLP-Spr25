"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/entries/");
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/delete-entry/${id}/`);
      fetchEntries(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>HLP Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Comments</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.hlp_number}</TableCell>
              <TableCell>{entry.date}</TableCell>
              <TableCell>{entry.score}</TableCell>
              <TableCell>{entry.comments}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => handleDelete(entry.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
