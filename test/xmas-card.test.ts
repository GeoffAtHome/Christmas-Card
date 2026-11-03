import { describe, it, expect } from "vitest";
import { render } from "lit";
import { XmasCard } from "../src/components/xmas-card";
import { CardData, CardGrid, CardItem } from "../src/components/card-type";

describe("xmas-card image map", () => {
  it("keeps area coordinates in the card image coordinate space", () => {
    const item: CardItem = {
      i: 18,
      x: 6,
      y: 3,
      w: 2,
      h: 1,
      t: "Family gathering",
      d: "",
      m: 0,
      n: 0,
    };
    const cardGrid: CardGrid = {
      i: "front.png",
      t: "Christmas Card 2024",
      l: "O-",
      s: "s-",
      w: 1024,
      h: 730,
      x: 8,
      y: 4,
      d: "",
      m: 1024,
      n: 721,
    };
    const cardData: CardData = { cardGrid, cardData: [item] };
    const card = new XmasCard();
    card.xmasCardData = {
      year: 2024,
      images: "2024/images",
      front: cardData,
      back: cardData,
    };

    const container = document.createElement("div");
    render(card.addArea(item, 18), container);

    expect(container.querySelector("area")?.getAttribute("coords")).toBe(
      "768,547.5,1024,730",
    );
  });
});
