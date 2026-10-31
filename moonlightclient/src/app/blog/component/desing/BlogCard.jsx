import { dataTagErrorSymbol } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function BlogCard({ post }) {
  
  return (
    <Link href={`/blog/${post.slug}`} className="group mt-[48px] mb-[8px] cursor-pointer flex flex-col px-4 md:px-0 sm:flex-row h-auto sm:h-[120px] gap-4 sm:gap-5 items-start sm:items-center">
      {/* Thumbnail */}
      <div className="relative w-full sm:w-[180px] h-[180px] sm:h-[110px] flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={"/logo.png"}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          alt={post?.blog_title || "Blog thumbnail"}
          width={500}
          height={500}
        />
      </div>

      {/* Content Details */}
      <div className="flex flex-col justify-between h-fit py-0.5 w-full">
        <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
          <span className="text-gray-600">Moonlight Machinery</span>
          <span>•</span>
          <span>{post?.readingTime || "5 min read"}</span>
        </div>

        <div className="space-y-1 mt-1 sm:mt-0">
          <h1 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {post?.blog_title || "Default Blog Title"}
          </h1>
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {post?.blog_description ||
              "A short description of the blog post goes here..."}
          </p>
        </div>
      </div>
    </Link>
  );
}