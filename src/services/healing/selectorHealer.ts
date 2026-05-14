export async function findBestSelector(
  page: any,
  failedSelector: string
): Promise<string | null> {

  try {

    const elements = await page.evaluate(() => {

      const all = Array.from(
        document.querySelectorAll("*")
      );

      return all.map((el: any) => ({
        tag: el.tagName?.toLowerCase(),
        id: el.id || "",
        text: el.innerText || "",
        className: el.className || "",
        type: el.type || "",
        placeholder: el.placeholder || "",
      }));

    });

    const keyword =
      failedSelector
        .replace("#", "")
        .replace("Btn", "")
        .toLowerCase();

    const scored: any[] = [];

    for (const el of elements) {

      let score = 0;

      const id =
        el.id.toLowerCase();

      const text =
        el.text.toLowerCase();

      const cls =
        el.className.toLowerCase();

      // exact id match
      if (id.includes(keyword)) {
        score += 10;
      }

      // button preference
      if (
        el.tag === "button"
      ) {
        score += 5;
      }

      // text similarity
      if (
        text.includes(keyword)
      ) {
        score += 3;
      }

      // class similarity
      if (
        cls.includes(keyword)
      ) {
        score += 2;
      }

      if (score > 0) {

        scored.push({
          selector: el.id
            ? `#${el.id}`
            : `text=${el.text}`,
          score,
        });

      }

    }

    scored.sort(
      (a, b) => b.score - a.score
    );

    if (scored.length > 0) {

      return scored[0].selector;

    }

    return null;

  } catch {

    return null;

  }

}