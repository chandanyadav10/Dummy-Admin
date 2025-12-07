"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Container,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  CircularProgress,
  Typography,
  Paper,
} from "@mui/material";
import { useUsersStore } from "@/store/usersStore";
import Link from "next/link";

const ROWS_PER_PAGE = 10;

function UsersTable() {
  const { users, total, loading, error, fetchUsers } = useUsersStore();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  const skip = useMemo(() => page * ROWS_PER_PAGE, [page]);

  useEffect(() => {
    fetchUsers({ q: search, limit: ROWS_PER_PAGE, skip });
  }, [search, skip, fetchUsers]);

  const handleChangePage = useCallback(
    (_: unknown, newPage: number) => {
      setPage(newPage);
    },
    []
  );

  return (
    <Paper sx={{ p: 2 }}>
      <Box mb={2} display="flex" justifyContent="space-between">
        <Typography variant="h6">Users</Typography>
        <TextField
          size="small"
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setPage(0);
            setSearch(e.target.value);
          }}
        />
      </Box>

      {loading && (
        <Box textAlign="center" my={3}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      {!loading && (
        <>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Company</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>
                    <Link href={`/dashboard/users/${u.id}`}>
                      {u.firstName} {u.lastName}
                    </Link>
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.gender}</TableCell>
                  <TableCell>{u.phone}</TableCell>
                  <TableCell>{u.company?.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={ROWS_PER_PAGE}
            rowsPerPageOptions={[ROWS_PER_PAGE]}
          />
        </>
      )}
    </Paper>
  );
}

export default function UsersPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <UsersTable />
    </Container>
  );
}
