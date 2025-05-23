function Tabs(elem) {
    const rootEl = elem;
    const tabsHeaderItems = rootEl.querySelectorAll(".tabs-header .tabs-item");
    const tabsBodyItems = rootEl.querySelectorAll(".tabs-body .tabs-item");

    onClick = (ev) => {
        const currentIndex = ev.currentTarget.getAttribute("data-index");

        tabsHeaderItems.forEach((tabsItem) => {
            if (ev.currentTarget == tabsItem) {
                tabsItem.classList.add("tabs--active");
            } else {
                tabsItem.classList.remove("tabs--active");
            }
        });

        tabsBodyItems.forEach((tabsItem) => {
            const index = tabsItem.getAttribute("data-index");

            if (currentIndex === index) {
                tabsItem.classList.add("tabs--active");
            } else {
                tabsItem.classList.remove("tabs--active");
            }
        });
    }

    tabsHeaderItems.forEach((tabsItem) => tabsItem.addEventListener("click", onClick))
}

window.addEventListener("load", () => {
    const tabsElements = document.querySelectorAll(".tabs");
    tabsElements.forEach(Tabs);
})
