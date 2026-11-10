import { describe, it, expect } from "vitest";
import { render } from "lit";
import { XmasCard } from "../src/components/xmas-card";
import { CardData, CardGrid, CardItem } from "../src/components/card-type";
import { thisYear } from "../src/years";

describe("xmas-card image map", () => {
  it("scales photo hit areas with the displayed card image", () => {
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

    const hitArea = container.querySelector("a.image-area");
    expect(hitArea?.getAttribute("style")).toBe(
      "left:75%;top:75%;width:25%;height:25%;",
    );
    expect(hitArea?.getAttribute("href")).toBe(
      `#${thisYear}#image#front#18`,
    );
  });
});
