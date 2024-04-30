// Render entities as HTML.
// We'll get rid of this soon.
const applyStyles = () => {
  for (const entity of entities) {
    document.querySelector(entity.id).innerHTML = entity.count;
    document.querySelector(
      entity.id
    ).style.transform = `rotate(${entity.angle}deg)`;
  }
};

setInterval(applyStyles, 500);
