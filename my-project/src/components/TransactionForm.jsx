import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function TransactionForm({
  onSubmit,
  categories,
  initialData = {},
}) {
  const [form, setForm] = useState({
    amount: initialData.amount || "",
    date: initialData.date || "",
    description: initialData.description || "",
    category: initialData.category || categories[0] || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.amount || !form.date || !form.description) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onSubmit(form);
      setForm({
        amount: "",
        date: "",
        description: "",
        category: categories[0] || "",
      });
    } catch (e) {
      setError("Failed to save transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="space-y-4 pt-6">
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        <Input
          type="date"
          name="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <Input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        {/* Category selection buttons */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`px-3 py-1 rounded-full border transition font-medium text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400
                ${
                  form.category === cat
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white/70 text-purple-700 border-purple-300 hover:bg-purple-100"
                }`}
              onClick={() => setForm({ ...form, category: cat })}
            >
              {cat}
            </button>
          ))}
        </div>
        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save"}
        </Button>
      </CardContent>
    </Card>
  );
}
