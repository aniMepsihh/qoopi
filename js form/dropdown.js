// document.addEventListener('DOMContentLoaded', function () {
//   const dropdowns = document.querySelectorAll('.custom-dropdown');

//   dropdowns.forEach((dropdown) => {
//     const toggle = dropdown.querySelector('.dropdown-toggle');
//     const menu = dropdown.querySelector('.dropdown-menu');
//     const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
//     const placeholder = dropdown.querySelector('.placeholder');

//     // Открытие/закрытие
//     toggle.addEventListener('click', function (e) {
//       e.stopPropagation();
//       dropdown.classList.toggle('open');
//     });

//     // Обновление плейсхолдера
//     function updatePlaceholder() {
//       const checked = Array.from(checkboxes)
//         .filter((checkbox) => checkbox.checked)
//         .map(
//           (checkbox) =>
//             checkbox.nextElementSibling.nextElementSibling.textContent
//         );

//       placeholder.textContent =
//         checked.length > 0 ? checked.join(', ') : 'Выберите категории';
//     }

//     // Обработка выбора
//     checkboxes.forEach((checkbox) => {
//       checkbox.addEventListener('change', updatePlaceholder);
//     });

//     // Закрытие при клике вне
//     document.addEventListener('click', function (e) {
//       if (!dropdown.contains(e.target)) {
//         dropdown.classList.remove('open');
//       }
//     });
//   });
// });
