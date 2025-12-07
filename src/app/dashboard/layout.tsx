import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import Link from "next/link";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Dummy Admin</Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Link href="/dashboard/users">Users</Link>
            <Link href="/dashboard/products">Products</Link>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>{children}</Box>
    </Box>
  );
}
