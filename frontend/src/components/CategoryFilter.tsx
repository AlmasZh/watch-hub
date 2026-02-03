"use client";

import { useEffect, useRef, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChevronRight, ChevronLeft } from "lucide-react";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CategoryFilterProps {
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
    categories,
    selectedCategory,
    onSelectCategory,
}: CategoryFilterProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    // Check scroll position to show/hide arrows
    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // buffer
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener("resize", checkScroll);
        return () => window.removeEventListener("resize", checkScroll);
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = direction === "left" ? -clientWidth / 2 : clientWidth / 2;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
            setTimeout(checkScroll, 300); // Check after animation
        }
    };

    return (
        <div className="relative group w-full max-w-[95%] mx-auto mt-8 mb-4">
            {/* Left Arrow */}
            {showLeftArrow && (
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 p-2 rounded-full text-white shadow-lg border border-gray-700 hover:bg-gray-800 transition-opacity"
                >
                    <ChevronLeft size={20} />
                </button>
            )}

            {/* Scrollable Container */}
            <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-1 scroll-smooth"
            >
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onSelectCategory(category)}
                        className={cn(
                            "whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border",
                            selectedCategory === category
                                ? "bg-white text-black border-white shadow-md transform scale-105"
                                : "bg-gray-800/50 text-gray-300 border-transparent hover:bg-gray-700 hover:text-white hover:border-gray-600"
                        )}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Right Arrow */}
            {showRightArrow && (
                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 p-2 rounded-full text-white shadow-lg border border-gray-700 hover:bg-gray-800 transition-opacity"
                >
                    <ChevronRight size={20} />
                </button>
            )}
        </div>
    );
}
