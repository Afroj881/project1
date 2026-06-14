const clients = [
  { id: 'client-1', name: 'Acme Inc.', email: 'accounts@acme.example.com' },
  { id: 'client-2', name: 'Zenith Co.', email: 'billing@zenith.example.com' },
];

export function getClientById(id) {
  return clients.find((client) => client.id === id) || null;
}
