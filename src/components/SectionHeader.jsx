function SectionHeader({ badge, title, description, size = "section" }) {
  return (
    <header
      className={
        size === "hero"
          ? "section-header section-header--hero"
          : "section-header section-header--section"
      }
    >
      <p className="section-header__badge">{badge}</p>
      <h1 className="section-header__title">{title}</h1>
      {description ? (
        <p className="section-header__description">{description}</p>
      ) : null}
    </header>
  );
}

export default SectionHeader;
