document.addEventListener('DOMContentLoaded', function () {
  const socialSelect = document.getElementById('social');
  const selectArrow = document.querySelector('.custom-select .select-arrow');

  if (!socialSelect || !selectArrow) return;

  let isSelectOpen = false;

  // Обработчики событий
  socialSelect.addEventListener('mousedown', handleSelectClick);
  socialSelect.addEventListener('change', closeSelect);
  socialSelect.addEventListener('blur', closeSelect);

  function handleSelectClick(e) {
    if (e.target.tagName !== 'OPTION') {
      isSelectOpen = !isSelectOpen;
      updateArrow();
    }
  }

  function closeSelect() {
    isSelectOpen = false;
    updateArrow();
  }

  function updateArrow() {
    selectArrow.style.transform = `translateY(-50%) ${
      isSelectOpen ? 'rotate(180deg)' : ''
    }`;
    selectArrow.style.stroke = isSelectOpen ? '#793eed' : '#8A8A8A';
  }
});
