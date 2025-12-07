import { apiFetch } from "@/lib/apiClient";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import Link from "next/link";

type UserDetails = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phone: string;
  image: string;
  company: {
    name: string;
    department: string;
    title: string;
  };
  address: {
    address: string;
    city: string;
    state: string;
  };
};

export default async function UserDetailPage({ params }: { params: { id: string } }) {
  const user = await apiFetch<UserDetails>(`/users/${params.id}`);

  return (
    <Container maxWidth="sm" sx={{ mt: 3 }}>
      <Button component={Link} href="/dashboard/users" variant="outlined" sx={{ mb: 2 }}>
        Back to Users
      </Button>
      <Card>
        <CardContent>
          <Typography variant="h6">
            {user.firstName} {user.lastName}
          </Typography>
          <Typography>{user.email}</Typography>
          <Typography>{user.phone}</Typography>
          <Typography mt={2} fontWeight={600}>
            Company
          </Typography>
          <Typography>{user.company.name}</Typography>
          <Typography>{user.company.title}</Typography>
          <Typography mt={2} fontWeight={600}>
            Address
          </Typography>
          <Typography>
            {user.address.address}, {user.address.city}, {user.address.state}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
