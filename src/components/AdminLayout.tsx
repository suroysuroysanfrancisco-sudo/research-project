import AdminSidebar from "../pages/admin/AdminSidebar";

export default function AdminLayout({ children }: any) {
  return (
    <div className="flex">
      <AdminSidebar />

      <main className="ml-64 w-full p-10 bg-background min-h-screen">
        {children}
      </main>
    </div>
  );
}
