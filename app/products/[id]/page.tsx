"use client";
import React, { useEffect, useState, use } from "react";
import { books } from "../../../lib/constant";
import Image from "next/image";
import useFancybox from "@/hooks/useFancybox";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  LocateIcon,
  MapPin,
  PersonStandingIcon,
  Share,
  Share2,
  ShoppingCart,
  ShoppingCartIcon,
  Verified,
  VerifiedIcon,
} from "lucide-react";
import { BsPerson } from "react-icons/bs";
import {
  useGetProductQuery,
  useCreateCartMutation,
} from "@store/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import toast from "react-hot-toast";
import { setCart, addToCart } from "@/src/store/slice/cartSlice";
import {addToWishList,clearWishList,removeFromWishListAction,setWishList} from "@/src/store/slice/wishListSlice";
import { productDetails } from "@/src/store/interface";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  const [book, setBook] = useState<productDetails | null>(null);
  const [changeImage, setChangeImage] = useState(book?.image[0]);

  const dispacth = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);
  const user = useSelector((state: RootState) => state.user.user);
  
  console.log("cart from redux: ", cart);

  const [createCart] = useCreateCartMutation();

  const [fancyboxRef] = useFancybox({});


  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const { data, isLoading, isError } = useGetProductQuery(id);

  useEffect(() => {
    const getProduct = async () => {
      if (data && data.success) {
        console.log("product id: ", data.data);
        setBook(data.data);
        setChangeImage(data.data.image[0]);
      }
    };

    getProduct();
  }, [id, data]);

  const handleAddToCart = async () => {
    try {
      if (book) {
        const response = await createCart({
         productId:book._id!,
         quantity:1
        }).unwrap();
        if (response.success) {
          console.log("response add to cart: ", response);
          
          toast.success("Produit ajouté au panier");
          dispacth(addToCart(response.data));
        }
      }
    } catch (error) {
      console.log("error add to cart: ", error);
      toast.error("Erreur lors de l'ajout au panier");
    }
  };



  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="relative container px-4 mx-auto min-h-screen w-full bg-gray-50">
      {book ? (
        <div
          key={book._id}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 w-full"
        >
          <div className="flex flex-col gap-4 mt-4">
            <div ref={fancyboxRef} className="flex flex-col space-y-2">
              <div className="bg-white shadow-md pt4 h-fit rounded-md">
                <div className="relative h-[400px] w-[300px] mx-auto">
                  <Image
                    src={changeImage!}
                    alt={book.title}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                {book.image.map((image: any, index: any) => (
                  <div
                    key={index}
                    className="relative group h-[50px] w-[70px]  "
                  >
                    <a data-fancybox="gallery" href={image}>
                      <Image
                        src={image}
                        alt={book.title}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover transform group-hover:scale-125 transition duration-300 ease-in-out"
                        onClick={() => setChangeImage(image)}
                      />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col mt-4 gap-2">
            <div className="flex items-center justify-between px-4">
              <div>
                <h3 className="text-2xl font-bold">{book.title}</h3>
                <span className="text-sm text-gray-500">
                  {formatDate(String(book.createdAt))}
                </span>
              </div>

         
            </div>

            <div className="flex gap-4">
              <span className="text-2xl font-bold">
                {user ? book.displayPrice : book.price}
              </span>

            </div>
            <button
              className="btn btn-primary rounded-md w-fit flex items-center gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingCartIcon className="w-6 h-6" />
              <span>acheter maintenant</span>
            </button>

            <div className="bg-white shadow-md  h-fit rounded-md md:w-1/2 w-full px-4 py-2">
              <h3 className="text-xl font-semibold text-gray-500 ">
                Book Details
              </h3>
              <div className="flex flex-col gap-2">
              
                <div className="flex justify-between ">
                  <span className="text-gray-400">Compte de client: </span>
                  <span className="text-gray-500">{book?.typeClient}</span>
                </div>
                <div className="flex justify-between ">
                  <span className="text-gray-400">Category</span>
                  <span className="text-gray-500">{book?.category}</span>
                </div>
                <div className="flex justify-between ">
                  <span className="text-gray-400">Classe:</span>
                  <span className="text-gray-500">{book?.productType}</span>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-md  h-fit rounded-md md:w-3/4 w-full px-4 py-2">
              <h3>Sold By</h3>

              <div className="flex items-center gap-4 mt-2">
                <div className="relative bg-amber-500 rounded-full w-15 h-15 flex items-center justify-center">
                  <BsPerson size={24} className="text-white" />
                </div>
                <div className="flex flex-col  items-start">
                  <div className="flex flex-items-center gap-2">
                    {/* <span className="text-gray-500 font-bold">
                      {book?.author}
                    </span> */}
                    <div
                      className="tooltip cursor-pointer flex"
                      data-tip="Vérifié"
                    >
                      <VerifiedIcon className="text-green-500" />
                      <span className="text-green-500">Vérifié</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-500">Ville</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-md  h-fit rounded-md md:w-3/4 w-full px-4 py-2">
              <h3 className="text-xl font-semibold text-gray-500 ">
                Description
              </h3>
              <p className="text-gray-500">{book?.description}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <span className="text-2xl text-gray-500">No book found</span>
        </div>
      )}
    </div>
  );
};

export default Page;
