'use client';
import { Edit, Heart, MessageCircle, Share2 } from 'lucide-react';
import { formatCurrency } from '../../../src/helpers/formatCurrency';

interface CardProps {
  id: number;
  serviceName: string;
  serviceCost: string;
  serviceDescription: string;
  image: string;
  likes?: number;
  onEdit: (id: number) => void;
  onLike: (id: number) => void;
  onBuy: () => void;
}

export default function Card({
  id,
  serviceName,
  serviceCost,
  serviceDescription,
  image,
  likes = 0,
  onEdit,
  onLike,
  onBuy,
}: CardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow transition-transform hover:-translate-y-1 flex flex-col">
      {/* Card Header */}
      <div className="bg-pink-200 px-4 py-2 flex justify-between items-center">
        <h2 className="text-sm text-gray-800">{serviceName}</h2>
        <button onClick={() => onEdit(id)} className="p-1 text-gray-600 hover:text-gray-800">
          <Edit className="w-4 h-4" />
        </button>
      </div>
      {/* Image */}
      <div className="relative w-full pb-[56.25%] overflow-hidden">
        <img src={image} alt={serviceName} className="absolute top-0 left-0 w-full h-full object-cover" />
      </div>
      {/* Card Footer */}
      <div className="bg-orange-100 px-3 py-3">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-red-500 font-medium">
              PRICE: Rs {formatCurrency(serviceCost)}
            </span>
            <div className="flex gap-1 items-center">
              <button
                onClick={() => onLike(id)}
                className="flex items-center gap-1 p-1 text-xs text-gray-600 hover:text-red-600"
              >
                <Heart className="w-4 h-4" />
                <span>{likes.toLocaleString()}</span>
              </button>
              <button className="flex items-center gap-1 p-1 text-xs text-gray-600">
                <MessageCircle className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 p-1 text-xs text-gray-600">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <p>{serviceDescription}</p>
          </div>
          <button
            onClick={onBuy}
            className="mt-2 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg font-semibold text-sm hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
          >
            Buy Service
          </button>
        </div>
      </div>
    </div>
  );
}
