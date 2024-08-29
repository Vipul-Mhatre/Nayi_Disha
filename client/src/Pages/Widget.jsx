import { useState } from 'react';

export default function Widget() {
  const [amount, setAmount] = useState(0);

  return (
    <div className="max-w-lg mx-auto p-6 bg-card rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Choose a donation amount</h2>
      <p className="text-muted-foreground mb-4">Most Donors donate approx ₹ 2500 to this Fundraiser</p>

      <div className="mb-4">
        <label className="block text-sm font-medium">Amount *</label>
        <input
          type="number"
          className="mt-1 p-2 border border-border rounded w-full"
          placeholder="2500"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium">Name *</label>
          <input type="text" className="mt-1 p-2 border border-border rounded w-full" placeholder="Arryaan Jain" required />
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            Make my donation anonymous
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Email ID *</label>
          <input type="email" className="mt-1 p-2 border border-border rounded w-full" placeholder="jainarryaan@gmail.com" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Your Mobile number *</label>
          <input type="tel" className="mt-1 p-2 border border-border rounded w-full" placeholder="Your Mobile number" required />
        </div>
        <button className="bg-primary text-primary-foreground hover:bg-primary/80 p-2 rounded-lg w-full">
          Proceed To Pay ₹{amount || 0}
        </button>
      </form>
    </div>
  );
}