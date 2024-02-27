import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { DashboardLayout } from '@/layouts/dashboard';
import { pb } from '@/@data/client';

function isAuthenticated() {
  const token = pb.authStore.token;
  return !!token;
}

export const Route = createFileRoute('/_private')({
  beforeLoad: async ({ location }) => {
    if (!isAuthenticated()) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Authenticated,
});

function Authenticated() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
