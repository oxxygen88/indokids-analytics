export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  BUYER: 'buyer',
  FINANCE: 'finance',
}

export const ROLE_LABELS = {
  admin: 'Admin',
  manager: 'Manager',
  buyer: 'Buyer',
  finance: 'Finance',
}

export const PERMISSIONS = {
  admin: ['dashboard', 'barang', 'supplier', 'barangBaru', 'upload'],
  manager: ['dashboard', 'barang', 'supplier', 'barangBaru'],
  buyer: ['dashboard', 'barang', 'barangBaru'],
  finance: ['dashboard', 'supplier'],
}

export function canAccess(role, permission) {
  return PERMISSIONS[role]?.includes(permission) || false
}