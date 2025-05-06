export const fetchItems = async ({ pageParam = 1, queryKey }) => {
  const [, search] = queryKey;
  const response = await fetch(
    `https://mil-val.vercel.app/api/items?page=${pageParam}&search=${
      search || ""
    }`
  );
  return response.json();
};

export const pinItem = async (id) => {
  const response = await fetch(
    `https://mil-val.vercel.app/api/items/${id}/pin`,
    {
      method: "POST",
    }
  );
  return response.json();
};

export const reorderItems = async (orderedIds) => {
  const response = await fetch("https://mil-val.vercel.app/api/items/reorder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderedIds }),
  });
  return response.json();
};

export const resetItems = async () => {
  const response = await fetch("https://mil-val.vercel.app/api/items/clear", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};
