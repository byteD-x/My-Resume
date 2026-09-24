from pathlib import Path
from tempfile import gettempdir

from playwright.sync_api import sync_playwright


def inspect_page(browser, width: int, height: int, label: str) -> None:
    page = browser.new_page(viewport={"width": width, "height": height})
    errors: list[str] = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(
        "http://127.0.0.1:3000/",
        wait_until="commit",
        timeout=90_000,
    )
    page.get_by_role("heading", level=1).wait_for(state="visible")
    page.screenshot(path=str(Path(gettempdir()) / f"portfolio-{label}.png"))
    metrics = page.evaluate(
        """() => {
          const heading = document.querySelector('h1');
          const rect = heading?.getBoundingClientRect();
          return {
            title: heading?.textContent?.trim(),
            headingTop: Math.round(rect?.top ?? -1),
            headingVisible: Boolean(rect && rect.bottom > 0 && rect.top < innerHeight),
            viewportWidth: innerWidth,
            documentWidth: document.documentElement.scrollWidth,
            viewportHeight: innerHeight,
            documentHeight: document.documentElement.scrollHeight,
            bodyBackground: getComputedStyle(document.body).backgroundImage,
          };
        }"""
    )
    print(f"{label}: {metrics}; pageErrors={errors}")
    page.close()


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    inspect_page(browser, 1440, 900, "desktop")
    inspect_page(browser, 390, 844, "mobile")
    browser.close()
