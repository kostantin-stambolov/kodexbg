"use client";

import { useId, useState } from "react";

const editorialTabs = [
  {
    id: "glas",
    label: "Глас",
    number: "01",
    title: "Текст, който звучи добре на глас.",
    body:
      "Детската книга трябва да се чете естествено вечер, без да подценява детето и без да изморява възрастния.",
    note: "ритъм, яснота, топлина",
  },
  {
    id: "obraz",
    label: "Образ",
    number: "02",
    title: "Илюстрации, които носят настроение.",
    body:
      "Образът не е украса около текста. Той създава свят, прави книгата запомняща се и я превръща в предмет с характер.",
    note: "свят, цвят, присъствие",
  },
  {
    id: "ritual",
    label: "Ритуал",
    number: "03",
    title: "Книга за момент, не само за рафт.",
    body:
      "Търсим истории за вечерна лампа, подарък, тих следобед и онова повторно отваряне, което прави книгата лична.",
    note: "дом, подарък, връщане",
  },
  {
    id: "yasnota",
    label: "Яснота",
    number: "04",
    title: "Покупката трябва да е спокойна.",
    body:
      "Цена, преглед, формат и поръчка трябва да са ясни. Без шум около решението и без излишно обясняване.",
    note: "преглед, цена, поръчка",
  },
];

export default function EditorialFocusTabs() {
  const [activeId, setActiveId] = useState(editorialTabs[0].id);
  const baseId = useId();
  const activeTab = editorialTabs.find((tab) => tab.id === activeId) ?? editorialTabs[0];

  return (
    <div className="editorial-tabs">
      <div className="editorial-tab-list" role="tablist" aria-label="Издателски фокус">
        {editorialTabs.map((tab) => (
          <button
            key={tab.id}
            id={`${baseId}-${tab.id}-tab`}
            type="button"
            role="tab"
            aria-selected={activeTab.id === tab.id}
            aria-controls={`${baseId}-${tab.id}-panel`}
            className="editorial-tab"
            onClick={() => setActiveId(tab.id)}
          >
            <span>{tab.number}</span>
            {tab.label}
          </button>
        ))}
      </div>
      <article
        id={`${baseId}-${activeTab.id}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-${activeTab.id}-tab`}
        className="editorial-tab-panel"
      >
        <span>{activeTab.number}</span>
        <div>
          <h3>{activeTab.title}</h3>
          <p>{activeTab.body}</p>
          <small>{activeTab.note}</small>
        </div>
      </article>
    </div>
  );
}
