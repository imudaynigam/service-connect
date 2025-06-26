import React, { useEffect, useRef } from 'react';

export default function ContactForm() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const maxHeight = 72; // 72px approximates 3 rows
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm sm:text-lg">
            First name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            required
            className="w-full border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent text-sm sm:text-base"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm sm:text-lg">
            Last name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            required
            className="w-full border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent text-sm sm:text-base"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm sm:text-lg">
          Email <span className="text-red-600">*</span>
        </label>
        <input
          type="email"
          required
          className="w-full border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent text-sm sm:text-base"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-xs sm:text-lg">Write a message</label>
        <textarea
          ref={textareaRef}
          rows={1}
          onInput={handleInput}
          style={{ maxHeight: '72px' }}
          className="w-full border-b-2 border-black focus:outline-none focus:border-blue-600 pb-1 bg-transparent resize-none overflow-y-auto text-xs sm:text-base"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
      >
        Send Message
      </button>
    </form>
  );
}
