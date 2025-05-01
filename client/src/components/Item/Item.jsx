import React, { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./item.scss";

export function Item({ id, item, onPin }) {
  //   const [isDragging, setIsDragging] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleClick = (e) => {
      e.stopPropagation();
      onPin();
    };

    button.addEventListener("click", handleClick, true);

    return () => {
      button.removeEventListener("click", handleClick, true);
    };
  }, [onPin]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "10px",
    margin: "5px",
    border: "1px solid #ccc",
    backgroundColor: item.pinned ? "#e6f7ff" : "white",
    display: "flex",
    justifyContent: "space-between",
    cursor: isDragging ? "grabbing" : "grab",
  };

  const handlePinClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onPin();
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="item"
    >
      <span className="item__text">{item.text}</span>
      <button
        ref={buttonRef}
        onClick={handlePinClick}
        onMouseDown={(e) => e.stopPropagation()}
        className="item__btn"
      >
        {item.pinned ? "Unpin" : "Pin"}
      </button>
    </div>
  );
}
