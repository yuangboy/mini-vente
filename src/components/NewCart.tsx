"use client";
import { books } from "@/lib/constant";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";



export const PrixReduction = (price: number, finalPrice: number) => {
  if (price > finalPrice && finalPrice > 0) {
    const reduction = Math.round(((price - finalPrice) / price) * 100);
    return reduction;
  }
  return 0;
};

const NewCart = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % 3);
  };
  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + 3) % 3);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % 3);
    }, 10000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <div className="relative">
        {books.length > 0 ? (
          <div className="overflow-hidden">
            <div
              className="flex transition transform ease-in-out duration-500"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {[0, 1, 2].map((indexSlice) => (
                <div key={indexSlice} className="flex-none w-full">
                  <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                    {books
                      .slice(indexSlice * 3, indexSlice * 3 + 3)
                      .map((book) => (
                        <div
                          key={book._id}
                          className="relative card bg-base-100 w-96 shadow-sm max-h-96"
                        >
                          <figure className="relative">
                            <img
                              src={book.images[0]}
                              alt="Shoes"
                              className="object-cover w-full"
                            />
                            <div className="absolute inset-0 bg-black opacity-50" />
                            {PrixReduction(book.price, book.finalPrice) > 0 && (
                              <span className="absolute top-0 left-0 badge badge-error text-white">
                                {PrixReduction(book.price, book.finalPrice)}
                                {"% "}off
                              </span>
                            )}
                          </figure>
                          <div className="card-body bg-[#FFBF00]/70">
                            <h2 className="card-title text-white font-medium">
                              {book.title}
                            </h2>
                            {/* <p>
                            A card component has a figure, a body part, and
                            inside body there are title and actions parts
                          </p> */}
                            <div className="flex justify-between items-center px-2">
                              <div className="flex gap-2">
                                <span className="text-black text-xl font-bold">
                                  {book.finalPrice}
                                </span>
                                <span className="line-through text-black">
                                  {book.price}
                                </span>
                              </div>
                              <span className="text-black">
                                {book.condition}
                              </span>
                            </div>
                            <div className="card-actions justify-end">
                              <button className="cursor-pointer rounded-md px-3 py-1 bg-[#F04E4F] text-white">
                                Acheter maintenant
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute top-1/2 transform -translate-y-1/2 left-4 right-4 flex justify-between">
              <button
                onClick={handlePrevSlide}
                className="w-fit rounded-full p-2 bg-white cursor-pointer"
              >
                <ArrowLeft />
              </button>
              <button
                onClick={handleNextSlide}
                className="w-fit rounded-full p-2 bg-white cursor-pointer"
              >
                <ArrowRight />
              </button>
            </div>

            <div className="flex justify-center mt-4">
              {[0, 1, 2].map((indexSlice) => (
                <button
                  key={indexSlice}
                  className={`w-4 h-4 mx-1 rounded-full ${
                    currentSlide === indexSlice ? "bg-blue-500" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentSlide(indexSlice)}
                ></button>
              ))}
            </div>
          </div>
        ) : (
          <div>No books found</div>
        )}
      </div>
    </>
  );
};

export default NewCart;
