import { Outlet } from 'react-router-dom';

export default function ProtectedOutlet() {
  // For now, bypass authentication since auth feature is removed
  // TODO: Implement authentication when auth feature is restored
  return <Outlet />;
}