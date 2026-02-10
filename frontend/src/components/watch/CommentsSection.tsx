"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import Image from "next/image";

interface Comment {
    id: string;
    author: string;
    avatar: string;
    text: string;
    timestamp: string;
    likes: number;
}

interface CommentsSectionProps {
    comments: Comment[];
}

export default function CommentsSection({ comments: initialComments }: CommentsSectionProps) {
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState("");

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        // In a real app, this would be an API call
        const comment: Comment = {
            id: Date.now().toString(),
            author: "You",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2680&auto=format&fit=crop", // Mock avatar
            text: newComment,
            timestamp: "Just now",
            likes: 0,
        };

        setComments([comment, ...comments]);
        setNewComment("");
    };

    return (
        <div className="flex flex-col gap-6 mt-6">
            <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-white">Comments</h3>
                <span className="text-gray-400 text-sm">{comments.length}</span>
            </div>

            {/* Add Comment Input */}
            <div className="flex gap-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2680&auto=format&fit=crop"
                        alt="User Avatar"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex-1">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full bg-transparent border-b border-gray-600 focus:border-white text-white py-2 outline-none transition-colors placeholder:text-gray-500"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddComment();
                        }}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            onClick={() => setNewComment("")}
                            className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-full transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                            className="px-4 py-2 text-sm font-bold text-black bg-blue-500 hover:bg-blue-400 disabled:bg-gray-700 disabled:text-gray-400 rounded-full transition-colors"
                        >
                            Comment
                        </button>
                    </div>
                </div>
            </div>

            {/* Comments List */}
            <div className="flex flex-col gap-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                                src={comment.avatar}
                                alt={comment.author}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-white text-sm font-semibold">
                                    {comment.author}
                                </span>
                                <span className="text-gray-400 text-xs">
                                    {comment.timestamp}
                                </span>
                            </div>
                            <p className="text-white/90 text-sm leading-relaxed">
                                {comment.text}
                            </p>

                            <div className="flex items-center gap-4 mt-1">
                                <button className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors group">
                                    <ThumbsUp size={16} className="group-hover:scale-110 transition-transform" />
                                    <span className="text-xs">{comment.likes > 0 ? comment.likes : ''}</span>
                                </button>
                                <button className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors group">
                                    <ThumbsDown size={16} className="group-hover:scale-110 transition-transform" />
                                </button>
                                <button className="text-gray-400 hover:text-white text-xs font-medium px-2 py-1 rounded-full hover:bg-white/5 transition-colors">
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
