import { useEffect, useState } from "react";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
} from "../services/api";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import { MonthlyExpensesChart, CategoryPieChart } from "../charts/Charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, PieChart, Clock } from "lucide-react";

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Other",
];

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    setLoading(true);
    const res = await getTransactions();
    setTransactions(res.data);
    setLoading(false);
  }

  const summary = categories.map((cat) => ({
    category: cat,
    value: transactions
      .filter((t) => t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0),
  }));
  const monthly = Object.values(
    transactions.reduce((acc, tx) => {
      const month = new Date(tx.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      acc[month] = acc[month] || { month, amount: 0 };
      acc[month].amount += tx.amount;
      return acc;
    }, {})
  );
  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
  const topCategory = summary.sort((a, b) => b.value - a.value)[0];
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 pb-16">
      {/* Header */}
      <header className="py-10 mb-8 bg-white/70 backdrop-blur-md shadow-lg rounded-b-3xl border-b border-purple-100">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-purple-700 tracking-tight drop-shadow-lg">
              Yardstick
            </h1>
            <p className="text-lg text-gray-500 mt-2 font-medium">
              Personal Finance Visualizer
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 text-white font-semibold shadow-md">
              Track. Visualize. Succeed.
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 space-y-10">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-16 mb-8">
          <Card className="bg-white/80 shadow-xl border-0 backdrop-blur-md hover:scale-[1.03] transition-transform duration-200">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="p-2 rounded-full bg-gradient-to-tr from-purple-400 to-blue-400 text-white shadow-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg font-bold text-purple-700">
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-gray-800">
                ${totalExpenses}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 shadow-xl border-0 backdrop-blur-md hover:scale-[1.03] transition-transform duration-200">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="p-2 rounded-full bg-gradient-to-tr from-pink-400 to-yellow-400 text-white shadow-lg">
                <PieChart className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg font-bold text-pink-600">
                Top Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold text-gray-700">
                {topCategory?.category || "-"}
              </div>
              <div className="text-md text-gray-400">
                ${topCategory?.value || 0}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 shadow-xl border-0 backdrop-blur-md hover:scale-[1.03] transition-transform duration-200">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="p-2 rounded-full bg-gradient-to-tr from-blue-400 to-green-400 text-white shadow-lg">
                <Clock className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg font-bold text-blue-600">
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1">
                {recentTransactions.length === 0 && (
                  <li>No recent transactions.</li>
                )}
                {recentTransactions.map((tx) => (
                  <li
                    key={tx._id}
                    className="flex justify-between items-center"
                  >
                    <span className="font-medium text-gray-700">
                      {tx.description}
                    </span>
                    <span className="text-gray-400">${tx.amount}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(tx.date).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Main Content: Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Sidebar: Form + Recent Transactions */}
          <div className="space-y-8 lg:sticky lg:top-24">
            <Card className="bg-white/90 shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-purple-700">
                  Add / Edit Transaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionForm
                  onSubmit={async (form) => {
                    editing
                      ? await updateTransaction(editing._id, form)
                      : await addTransaction(form);
                    setEditing(null);
                    refresh();
                  }}
                  initialData={editing || {}}
                  categories={categories}
                />
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-100 to-purple-100 shadow border-0">
              <CardHeader>
                <CardTitle className="text-blue-700">
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  {recentTransactions.length === 0 && (
                    <li>No recent transactions.</li>
                  )}
                  {recentTransactions.map((tx) => (
                    <li
                      key={tx._id}
                      className="flex justify-between items-center"
                    >
                      <span className="font-medium text-gray-700">
                        {tx.description}
                      </span>
                      <span className="text-gray-400">${tx.amount}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(tx.date).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Main Area: Charts + Full Transaction List */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-purple-100 to-blue-100 shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-purple-700">
                    Monthly Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MonthlyExpensesChart data={monthly} />
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-pink-100 to-yellow-100 shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-pink-600">
                    Category Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CategoryPieChart data={summary} />
                </CardContent>
              </Card>
            </div>
            <Card className="bg-white/90 rounded-2xl shadow-lg border-0 p-2">
              <CardHeader>
                <CardTitle className="text-purple-700">
                  All Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-gray-500 animate-pulse">
                    Loading transactions...
                  </div>
                ) : (
                  <TransactionList
                    transactions={transactions}
                    onEdit={setEditing}
                    onDelete={async (id) => {
                      await deleteTransaction(id);
                      refresh();
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
