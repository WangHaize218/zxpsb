function ModuleCard({ eyebrow, title, description, buttonLabel, onClick }) {
  return (
    <article className="module-card">
      <div className="module-card__topline">
        <p className="module-card__eyebrow">{eyebrow}</p>
        <span className="module-card__signal">在线</span>
      </div>
      <h3 className="module-card__title">{title}</h3>
      <p className="module-card__description">{description}</p>
      <div className="module-card__footer">
        <button className="module-card__button" onClick={onClick} type="button">
          <span>{buttonLabel}</span>
          <span className="module-card__arrow" aria-hidden="true">
            进入
          </span>
        </button>
      </div>
    </article>
  );
}

export default ModuleCard;
