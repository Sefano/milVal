// import express from "express";
// import cors from "cors";

const express = require("express");
const cors = require("cors");

const app = express();
const port = 7777;

app.use(cors());
app.use(express.json());

// Инициализация
const generateItems = () => {
  const items = new Map();
  for (let i = 1; i <= 1000000; i++) {
    items.set(i.toString(), {
      id: i.toString(),
      text: `Item ${i}`,
      pinned: false,
      order: i,
    });
  }
  return items;
};

let items = generateItems();

let customOrder = null;

app.get("/", (req, res) => {
  res.json("HELLO");
});
// Получение элементов
app.get("/api/items", (req, res) => {
  const { page = 1, search = "" } = req.query;
  const perPage = 20;

  // Поиск
  let filteredItems = Array.from(items.values());
  if (search) {
    filteredItems = filteredItems.filter((item) =>
      item.text.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Сортировка
  filteredItems.sort((a, b) => a.order - b.order);

  // Пагинация
  const startIndex = (page - 1) * perPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + perPage);

  res.json({
    items: paginatedItems,
    total: filteredItems.length,
    hasMore: startIndex + perPage < filteredItems.length,
  });
});

// Закрепить/открепить
app.post("/api/items/:id/pin", (req, res) => {
  const { id } = req.params;
  const item = items.get(id);

  if (item) {
    item.pinned = !item.pinned;
    res.json(item);
  } else {
    res.status(404).json({ error: "Item not found" });
  }
});

// Извенение порядка на беке
app.post("/api/items/reorder", (req, res) => {
  const { orderedIds } = req.body;

  orderedIds.forEach((id, index) => {
    const item = items.get(id);
    if (item) {
      item.order = index + 1;
    }
  });

  customOrder = orderedIds;
  res.json({ success: true });
});

//Ресет порядка
app.post("/api/items/clear", (req, res) => {
  items = generateItems();
  res.json({ success: true });
});

app.listen(port, () => console.log(`Сервер запущен на порту ${port}`));
// const start = () => {
//   try {
//     app.listen(port, () => {
//       console.log(`Сервер запущен на порту ${port}`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// start();
