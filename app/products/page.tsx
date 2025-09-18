"use client";

import { filters } from "../../lib/constant";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import Spinner from "@components/Spinner";
import Image from "next/image";
import { Pagination } from "@components/Pagination";
import { useGetProductsQuery } from "@/src/store/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
// import { books } from "../../lib/constant";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { productDetails } from "@/src/store/interface";

export default function Books() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedTypeClient, setSelectedTypeClient] = useState<string[]>([]);
  const [selectedProductType, setSelectedProductType] = useState<string[]>([]);

  const [sortOption, setSortOption] = useState<string>("newest");
  const [isLoading, setIsLoading] = useState(false);
  const bookPerPage = 6;

  const [books, setBooks] = useState<productDetails[]>([]);

  const { data } = useGetProductsQuery();

  useEffect(() => {
    const getProducts = async () => {
      try {
        if (data?.success) {
          console.log("data products : ", data);
          setBooks(data?.data);
        } else {
          console.log("data introuvables");
        }
      } catch (error) {
        console.log("error: ", error);
      }
    };

    getProducts();
  }, [data]);

  const toogleFilter = (section: string, item: string) => {
    const updateFilter = (prev: string[]) => {
      if (prev.includes(item)) {
        return prev.filter((i) => i !== item);
      } else {
        return [...prev, item];
      }
    };

    switch (section) {
      case "condition":
        setSelectedCondition(updateFilter);
        break;
      case "category":
        setSelectedCategory(updateFilter);
        break;
      case "type":
        setSelectedType(updateFilter);
        break;
    }

    setCurrentPage(1);
  };

  const searchTerms =
    new URLSearchParams(window.location.search).get("search") || "";

  const filterBooks = books.filter((book) => {
    const typeClientMatch =
      selectedTypeClient.length === 0 ||
      selectedTypeClient
        .map((c) => c.toLowerCase())
        .includes(book?.typeClient.toLowerCase());

    const categoryMatch =
      selectedCategory.length === 0 ||
      selectedCategory
        .map((c) => c.toLowerCase())
        .includes(book?.category.toLowerCase());

    const productTypeMacth =
      selectedProductType.length === 0 ||
      selectedProductType
        .map((c) => c.toLowerCase())
        .includes(book.productType.toLowerCase());

    // const searchMatch=searchTerms ? book.title.toLowerCase().includes(searchTerms.toLowerCase())
    // || book.author.toLowerCase().includes(searchTerms.toLowerCase())
    // || book.category.toLowerCase().includes(searchTerms.toLowerCase())
    // || book.subject.toLowerCase().includes(searchTerms.toLowerCase())
    // :true

    return typeClientMatch && categoryMatch && productTypeMacth;
  });

  const sortedBooks = [...filterBooks].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return (
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
        );
      case "priceLowToHigh":
        return a.price - b.price;
      case "priceHighToLow":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedBooks.length / bookPerPage);
  //   const startIndex = (currentPage - 1) * bookPerPage;
  //   const endIndex = startIndex + bookPerPage;
  //   const currentBooks = sortedBooks.slice(startIndex, endIndex);

  const paginateBooks = sortedBooks.slice(
    (currentPage - 1) * bookPerPage,
    currentPage * bookPerPage
  );

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  console.log("user: ", user);

  return (
    <div className="min-h-screen bg-muted">
      <div className="container mx-auto py-6">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="text-primary hover:underline">
            Home
          </Link>
          <span>/</span>
          <span>Books</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 mt-6">
          {/* Filtres */}
          <div className="space-y-2">
            {Object.entries(filters).map(([key, value]) => (
              <Accordion type="single" collapsible key={key}>
                <AccordionItem value={key}>
                  <AccordionTrigger className="font-semibold capitalize">
                    {key}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {value.map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <Checkbox
                            checked={
                              key === "typeClient"
                                ? selectedTypeClient.includes(item)
                                : key === "category"
                                ? selectedCategory.includes(item)
                                : key === "productType"
                                ? selectedProductType.includes(item)
                                : false
                            }
                            onCheckedChange={() => toogleFilter(key, item)}
                          />
                          <label className="text-sm">{item}</label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>

          {/* Résultats */}
          <div className="flex flex-col gap-4">
            {paginateBooks.length > 0 ? (
              <>
                <div className="flex justify-end">
                  <Select
                    defaultValue={sortOption}
                    onValueChange={(val) => setSortOption(val)}
                  >
                    <SelectTrigger className="w-[200px] bg-primary text-white">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="priceLowToHigh">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="priceHighToLow">
                        Price: High to Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
                  {paginateBooks.map((book) => (
                    <motion.div
                      key={book._id}
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="relative group overflow-hidden h-[300px]">
                        <Link href={`products/${book._id}`}>
                          <div className="relative">
                            <Image
                              alt={book.title}
                              src={book.image[0]}
                              width={400}
                              height={300}
                              className="w-full h-[200px] object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <CardContent className="px-4 py-2">
                            <div className="font-semibold text-primary">
                              {book.title}
                            </div>
                            {book.price && (
                              <div className="text-sm text-muted-foreground">
                                {user ? book.displayPrice : book.price}
                              </div>
                            )}
                            <div className="absolute bottom-2 left-4 text-xs text-muted-foreground">
                              {formatDate(String(book.createdAt))}
                            </div>
                          </CardContent>
                        </Link>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handleChangePage}
                />
              </>
            ) : (
              <p className="text-center text-muted-foreground">
                No books found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
