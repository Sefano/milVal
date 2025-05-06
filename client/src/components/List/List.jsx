import "./list.scss";
import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Item } from "../Item/Item";
import { SearchInput } from "../SearchInput/SearchImput";

import { fetchItems, pinItem, reorderItems, resetItems } from "../../api/api";
import { useDebounce } from "../../hooks/useDebounce";

const List = () => {
  const [search, setSearch] = useState("");
  const searchInputRef = useRef(null);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const searchDebounce = useDebounce(search, 500);

  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["items", searchDebounce],
    queryFn: fetchItems,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.items.length < 20) return undefined;
      return pages.length + 1;
    },
  });

  const pinMutation = useMutation({
    mutationFn: pinItem,
    onSuccess: () => {
      queryClient.invalidateQueries(["items"]);
    },
  });

  const handlePinItem = (item) => {
    pinMutation.mutate(item.id);
  };

  const reorderMutation = useMutation({
    mutationFn: reorderItems,
    onSuccess: () => {
      queryClient.invalidateQueries(["items"]);
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const items = data?.pages.flatMap((page) => page.items) || [];

  const handleScroll = useCallback(
    (e) => {
      const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
      if (
        scrollHeight - (scrollTop + clientHeight) < 50 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      reorderMutation.mutate(newItems.map((item) => item.id));
    }
  };

  if (isLoading) return <div>Подождите...</div>;

  if (isError) return <div>Ошибка сервера</div>;

  const handleResetImems = () => {
    resetItems();
    setTimeout(() => window.location.reload(), 700);
    // window.location.reload();
  };

  return (
    <div className="list">
      <h1>Список элементов</h1>

      <SearchInput value={search} onChange={handleSearchChange}></SearchInput>
      <button className="list__btn" onClick={handleResetImems}>
        Сбросить
      </button>

      <div
        style={{ height: "80vh", overflowY: "auto" }}
        onScroll={handleScroll}
        className="list__items"
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
          onClick={(e) => {
            if (e.target.tagName === "BUTTON") {
              e.stopPropagation();
            }
          }}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <Item
                key={item.id}
                id={item.id}
                item={item}
                onPin={() => handlePinItem(item)}
              />
            ))}
          </SortableContext>
        </DndContext>

        {isFetchingNextPage && <div>Загрузка...</div>}
      </div>
    </div>
  );
};

export default List;
