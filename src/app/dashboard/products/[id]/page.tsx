"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiClient";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  IconButton,
  Typography,
} from "@mui/material";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import Link from "next/link";
import type { Product } from "@/store/productsStore";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      const data = await apiFetch<Product>(`/products/${params.id}`);
      setProduct(data);
    };
    load();
  }, [params.id]);

  if (!product) {
    return (
      <Container sx={{ mt: 3 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  const images = product.images?.length ? product.images : [product.thumbnail];

  const handlePrev = () => {
    setImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Button component={Link} href="/dashboard/products" variant="outlined" sx={{ mb: 2 }}>
        Back to Products
      </Button>
      <Card sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
        <Box sx={{ position: "relative", flex: 1, minHeight: 320 }}>
          <CardMedia
            component="img"
            image={images[imgIndex]}
            alt={product.title}
            sx={{ height: "100%", objectFit: "contain" }}
          />
          {images.length > 1 && (
            <>
              <IconButton
                onClick={handlePrev}
                sx={{ position: "absolute", top: "50%", left: 8, transform: "translateY(-50%)" }}
              >
                <ArrowBackIos fontSize="small" />
              </IconButton>
              <IconButton
                onClick={handleNext}
                sx={{ position: "absolute", top: "50%", right: 8, transform: "translateY(-50%)" }}
              >
                <ArrowForwardIos fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h6" mb={1}>
            {product.title}
          </Typography>
          <Typography variant="subtitle1" mb={1}>
            ${product.price}
          </Typography>
          <Typography variant="body2" mb={2}>
            {product.description}
          </Typography>
          <Typography variant="body2">Category: {product.category}</Typography>
          <Typography variant="body2">Rating: {product.rating}</Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
