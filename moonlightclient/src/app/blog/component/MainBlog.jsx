"use client";
import React from "react";
import BlogCard from "./desing/BlogCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function MainBlog() {
  // const data = [
  //   {
  //     id: 1,
  //     slug: "hii",
  //     title: "The new paper palte making machien buisness",
  //     description:
  //       "Yes this paper plate making busines is the best of the best buisness for your pessive income and use to gain bettter understand the product and make more money with expreiece real life example ok and see the earning method",
  //     image: "/logo.png",
  //     date: "10/20/2026",
  //     readingTime: "1 min",
  //   },
  //   {
  //     id: 2,
  //     slug: "hii",
  //     title: "The new paper palte making machien buisness",
  //     description:
  //       "Yes this paper plate making busines is the best of the best buisness for your pessive income",
  //     image: "/logo.png",
  //     date: "10/20/2026",
  //     readingTime: "1 min",
  //   },
  //   {
  //     id: 3,
  //     slug: "hii",
  //     title: "The new paper palte making machien buisness",
  //     description:
  //       "Yes this paper plate making busines is the best of the best buisness for your pessive income",
  //     image: "/logo.png",
  //     date: "10/20/2026",
  //     readingTime: "1 min",
  //   },
  //   {
  //     id: 1,
  //     slug: "hii",
  //     title: "The new paper palte making machien buisness",
  //     description:
  //       "Yes this paper plate making busines is the best of the best buisness for your pessive income",
  //     image: "/logo.png",
  //     date: "10/20/2026",
  //     readingTime: "1 min",
  //   },
  //   {
  //     id: 4,
  //     slug: "hii",
  //     title: "The new paper palte making machien buisness",
  //     description:
  //       "Yes this paper plate making busines is the best of the best buisness for your pessive income",
  //     image: "/logo.png",
  //     date: "10/20/2026",
  //     readingTime: "1 min",
  //   },
  // ];
  const skeletonFeture = () => {
    return (
      <div className="mx-auto flex flex-col sm:flex-row h-auto sm:h-[120px] max-w-[1200px] items-start sm:items-center justify-center gap-4 sm:gap-5 animate-pulse px-4">
        {/* Thumbnail Skeleton */}
        <div className="w-full sm:w-[180px] h-[180px] sm:h-[110px] flex-shrink-0 rounded-lg bg-gray-200" />

        {/* Content Details Skeleton */}
        <div className="flex flex-col justify-between h-fit sm:h-full py-0.5 max-w-[600px] w-full">
          {/* Top Meta Skeleton */}
          <div className="flex items-center gap-3">
            <div className="h-3 w-32 bg-gray-200 rounded" />
            <div className="h-3 w-3 bg-gray-200 rounded-full" />
            <div className="h-3 w-16 bg-gray-200 rounded" />
          </div>

          {/* Main Text Skeleton */}
          <div className="space-y-2 mt-2 sm:mt-0">
            <div className="h-5 w-3/4 bg-gray-200 rounded" />
            <div className="space-y-1">
              <div className="h-3.5 w-full bg-gray-200 rounded" />
              <div className="h-3.5 w-2/3 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getBlogFn = async () => {
    const res = await axios.get("/api/home/blog/get");
    if (!res) {
      return;
    } else {
      // console.log(res.data.data)
      return res.data.data;
    }
  };
  const { data, isLoading } = useQuery({
    queryKey: ["getBlog"],
    queryFn: getBlogFn,
  });
  if (isLoading) {
    return skeletonFeture();
  }
  return (
    <div className="flex w-full justify-center items-center ">
      <div className="blog-containe w-full  max-w-[1000px] justify-center items-center grid gap-4">
        {data?.map((item, index) => (
          <BlogCard post={item} />
        ))}
      </div>
    </div>
  );
}
