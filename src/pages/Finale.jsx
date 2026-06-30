function Finale({ onBackHome }) {
  return (
    <section className="finale">
      <div className="finale__panel">
        <p className="finale__badge">最后一页</p>
        <h1>这不是告别页面</h1>
        <p>
          这是我们把一部分陪伴，偷偷塞进了你的相册里。你可以去很远的地方，可以认识新的人，可以拥有新的生活。
        </p>
        <p>
          但你不许消失。主线任务：好好生活。隐藏任务：记得回来。
        </p>
        <strong>允许出国，不许失联。</strong>
        <button onClick={onBackHome} type="button">
          回到补给站
        </button>
      </div>
    </section>
  );
}

export default Finale;
