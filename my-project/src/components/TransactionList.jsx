import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TransactionList({ transactions, onEdit, onDelete }) {
  if (!transactions.length) {
    return (
      <div className="text-center text-gray-500">No transactions yet.</div>
    );
  }
  return (
    <div className="space-y-2">
      {transactions.map((tx) => (
        <Card key={tx._id} className="bg-white">
          <CardContent className="flex justify-between items-center py-4">
            <div>
              <p className="font-semibold">
                {tx.description}: ${tx.amount}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(tx.date).toLocaleDateString()} - {tx.category}
              </p>
            </div>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => onEdit(tx)}>
                Edit
              </Button>
              <Button variant="destructive" onClick={() => onDelete(tx._id)}>
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
