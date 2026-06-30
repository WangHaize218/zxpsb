import { useEffect, useRef } from "react";

function AppShell({ activePage, children, entering = false, navItems, onNavigate }) {
  const hideNav = activePage === "radio";
  const contentRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [activePage]);

  return (
    <div className={entering ? "app-shell app-shell--enter" : "app-shell"}>
      <div className="app-shell__bg app-shell__bg--one" />
      <div className="app-shell__bg app-shell__bg--two" />
      <div className="app-shell__grid" />
      <main ref={contentRef} className="app-shell__content">
        {children}
      </main>
      {!hideNav ? (
        <nav className="bottom-nav" aria-label="主导航">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={
                item.id === activePage
                  ? "bottom-nav__item bottom-nav__item--active"
                  : "bottom-nav__item"
              }
              aria-current={item.id === activePage ? "page" : undefined}
              onClick={() => onNavigate(item.id)}
              type="button"
            >
              <span className="bottom-nav__label">{item.label}</span>
            </button>
          ))}
        </nav>
      ) : null}
    </div>
  );
}

export default AppShell;
