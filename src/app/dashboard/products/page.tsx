"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  ChangeEvent,
} from "react";
import {
  Box,
  Container,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Pagination,
} from "@mui/material";
import Link from "next/link";
import { useProductsStore } from "@/store/productsStore";

const LIMIT = 10;

const ProductsPage: React.FC = () => {
  const { products, total, loading, error, fetchProducts } = useProductsStore();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const skip = useMemo(() => (page - 1) * LIMIT, [page]);
  const totalPages = useMemo(
    () => (total > 0 ? Math.ceil(total / LIMIT) : 1),
    [total]
  );

  useEffect(() => {
    fetchProducts({ q: search, limit: LIMIT, skip, category });
  }, [search, skip, category, fetchProducts]);

  const handlePageChange = useCallback(
    (_: ChangeEvent<unknown>, value: number) => {
      setPage(value);
    },
    []
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPage(1);
      setSearch(e.target.value);
    },
    []
  );

  const handleCategoryChange = useCallback(
    (e: any) => {
      setPage(1);
      setCategory(e.target.value as string);
    },
    []
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      {/* Header + controls */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        mb={3}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h5" component="h1">
          Products
        </Typography>

        <Box display="flex" flexWrap="wrap" gap={2}>
          <TextField
            size="small"
            placeholder="Search products..."
            value={search}
            onChange={handleSearchChange}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={category}
              onChange={handleCategoryChange}
            >
              {/* In real app, fetch categories from /products/categories */}
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="smartphones">Smartphones</MenuItem>
              <MenuItem value="laptops">Laptops</MenuItem>
              <MenuItem value="fragrances">Fragrances</MenuItem>
              <MenuItem value="skincare">Skincare</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Loading / error */}
      {loading && (
        <Box textAlign="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && !loading && (
        <Typography color="error" variant="body2" mb={2}>
          {error}
        </Typography>
      )}

      {/* Products grid using Box (CSS grid) */}
      {!loading && (
        <Box
          display="grid"
          gap={2}
          gridTemplateColumns={{
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
        >
          {products.map((p) => (
            <Box key={p.id}>
              <Card
                component={Link}
                href={`/dashboard/products/${p.id}`}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={p.thumbnail}
                  alt={p.title}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" noWrap>
                    {p.title}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    ${p.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Category: {p.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rating: {p.rating}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}

          {!products.length && !loading && !error && (
            <Box gridColumn="1 / -1">
              <Typography>No products found.</Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Pagination */}
      {total > LIMIT && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
          />
        </Box>
      )}
    </Container>
  );
};

export default ProductsPage;
