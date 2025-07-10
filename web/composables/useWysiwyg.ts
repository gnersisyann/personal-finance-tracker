export function useWysiwyg() {
  const { smoothScroll } = useAppScroll();

  const $config = {
    public: {
      assetsUrl: "/assets",
    },
  };

  const $bus = {
    event: (eventName: string, data: any) => {
      console.log("Event:", eventName, data);
    },
  };

  const emailMatchingPattern =
    /\b(?!<a[^>]*>)([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})(?![^<]*<\/a>)/gi;

  const createIcon = (iconName: string) => {
    const icon = document.createElement("span");

    icon.className = "app-icon open-in-new";
    icon.setAttribute("data-icon-name", iconName);
    icon.setAttribute("style", "fontSize: inherit");

    return icon;
  };

  const processTables = (content: HTMLElement) => {
    const tables = [].slice.call(
      content.querySelectorAll(".wysiwyg table")
    ) as HTMLTableElement[];

    for (const table of tables) {
      const rows = [].slice.call(
        table.querySelectorAll("tbody tr")
      ) as HTMLTableRowElement[];

      const titles = [] as string[];

      const firstRow = rows[0];

      if (!firstRow) return;

      for (const header of firstRow.cells) {
        if (!header.textContent) continue;

        titles.push(header.textContent);
      }

      rows.shift();

      for (const row of rows) {
        for (const [index, cell] of [...row.cells].entries()) {
          cell.setAttribute("data-label", titles[index]!);
        }
      }
    }
  };

  const processLinks = (content: HTMLElement) => {
    const links = [].slice.call(
      content.querySelectorAll('.wysiwyg a[target="_blank"]')
    ) as HTMLAnchorElement[];

    const downloadLinks = [].slice.call(
      content.querySelectorAll(
        `.wysiwyg a[href^="${$config.public.assetsUrl}"][href$="?download"]:not([target="_blank"]`
      )
    ) as HTMLAnchorElement[];

    for (const link of links) {
      link.appendChild(createIcon("open_in_new"));
    }

    for (const link of downloadLinks) {
      link.appendChild(createIcon("download"));
    }
  };

  const processEmailAddresses = (contentString: string) => {
    return contentString.replaceAll(
      emailMatchingPattern,
      (match, linkedEmail) => {
        return linkedEmail ? match : `<a href="mailto:${match}">${match}</a>`;
      }
    );
  };

  const processWysiwyg = (content: HTMLElement) => {
    processTables(content);
    processLinks(content);
  };

  const handleWysiwygClick = (event: MouseEvent) => {
    const element = event.target as HTMLElement;

    if (element.tagName !== "A") return;

    if (element.getAttribute("target") === "_blank") return;

    const href = element.getAttribute("href");

    if (!href?.startsWith("#")) return;

    smoothScroll();

    $bus.event("user:anchor-click", href);
  };

  return {
    processWysiwyg,
    handleWysiwygClick,
    processEmailAddresses,
  };
}
