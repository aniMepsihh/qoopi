document.addEventListener('DOMContentLoaded', function () {
  // Элементы основного модального окна
  const modalOverlay = document.getElementById('modal');
  const modalContainer = document.querySelector('.modal-container');
  const openModalBtn = document.querySelector('#openModalBtn');
  const closeModalBtn = document.querySelector('.close-modal-btn');
  const form = document.getElementById('blogger-form');
  const submitBtn = document.querySelector('.submit-btn');
  const burgerBtn = document.querySelector('#burgerBtn');


  // Элементы модального окна подтверждения
  const successModal = document.getElementById('successModal');
  const successModalClose = document.getElementById('successModalClose');

  // Функция открытия основного модального окна
  function openModal() {
    modalOverlay.style.display = 'flex'
    burgerBtn.style.display = 'none'

    // Сбрасываем форму и ошибки
    if (form) {
      form.reset();
      document.getElementById('agreement').checked = false;
      document.getElementById('newsletter').checked = false;

      document.querySelectorAll('.error-field').forEach((el) => {
        el.classList.remove('error-field');
      });
      document.querySelectorAll('.checkbox-group').forEach((el) => {
        el.classList.remove('error');
      });
      document.getElementById('form-alert').style.display = 'none';
    }

    setTimeout(() => {
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }, 10);
  }

  // Функция закрытия основного модального окна
  function closeModal() {
    modalOverlay.classList.remove('active');

    setTimeout(() => {
      modalOverlay.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
    setTimeout(() => {
      burgerBtn.style.display = 'flex'
    }, 100);
  }

  // Функция открытия модального окна подтверждения
  function openSuccessModal() {
    successModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Функция закрытия модального окна подтверждения
  function closeSuccessModal() {
    successModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Обработчики событий для основного модального окна
  openModalBtn.addEventListener('click', openModal);
  closeModalBtn.addEventListener('click', closeModal);

  // Обработчики событий для модального окна подтверждения
  if (successModalClose) {
    successModalClose.addEventListener('click', closeSuccessModal);
  }

  if (successModal) {
    successModal.addEventListener('click', function (e) {
      if (e.target === successModal) {
        closeSuccessModal();
      }
    });
  }

  // Клик по оверлею основного модального окна
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Закрытие по Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (modalOverlay.classList.contains('active')) {
        closeModal();
      } else if (successModal.classList.contains('active')) {
        closeSuccessModal();
      }
    }
  });

  // Блокируем всплытие событий от контейнера
  modalContainer.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  // Инициализация маски телефона
  function initPhoneMask() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;

    phoneInput.addEventListener('input', function (e) {
      let x = e.target.value
        .replace(/\D/g, '')
        .match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
      e.target.value = !x[2]
        ? '+7'
        : `+7 (${x[2]}${x[3] ? `) ${x[3]}` : ''}${x[4] ? `-${x[4]}` : ''}${
            x[5] ? `-${x[5]}` : ''
          }`;
    });
  }

  // Инициализация маски подписчиков
  function initFollowersMask() {
    const followersInput = document.getElementById('followers');
    if (!followersInput) return;

    followersInput.addEventListener('input', function (e) {
      let value = e.target.value.replace(/\D/g, '');
      e.target.value =
        value.length > 3 ? value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : value;
    });
  }

  // Автозаполнение ссылки на соцсеть
  function initSocialAutocomplete() {
    const socialSelect = document.getElementById('social');
    const accountInput = document.getElementById('account');
    if (!socialSelect || !accountInput) return;

    socialSelect.addEventListener('change', function () {
      const domains = {
        instagram: 'https://instagram.com/',
        youtube: 'https://youtube.com/',
        tiktok: 'https://tiktok.com/@',
        other: 'https://',
      };
      accountInput.value = domains[this.value.toLowerCase()] || 'https://';
    });
  }

  // Обработка отправки формы
  if (submitBtn && form) {
    submitBtn.addEventListener('click', function (e) {
      e.preventDefault();
      handleFormSubmit();
    });
  }

  // Функция обработки отправки формы
  function handleFormSubmit() {
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      social: document.getElementById('social').value,
      account: document.getElementById('account').value,
      followers: document.getElementById('followers').value,
      agreement: document.getElementById('agreement').checked,
      newsletter: document.getElementById('newsletter').checked,
    };

    if (!validateForm(formData)) return;

    console.log('Form data:', formData);

    // Закрываем основное модальное окно и открываем окно подтверждения
    closeModal();
    setTimeout(() => {
      openSuccessModal();
    }, 300);

    // Здесь можно добавить реальную отправку данных на сервер
    // fetch('/api/submit', {
    //   method: 'POST',
    //   body: JSON.stringify(formData),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })
    // .then(response => response.json())
    // .then(data => {
    //   openSuccessModal();
    // })
    // .catch(error => {
    //   console.error('Error:', error);
    // });
  }

  // Валидация формы
  function validateForm(formData) {
    let isValid = true;
    const alertElement = document.getElementById('form-alert');

    // Сбрасываем предыдущие ошибки
    document.querySelectorAll('.error-field').forEach((el) => {
      el.classList.remove('error-field');
    });
    document.querySelectorAll('.checkbox-group').forEach((el) => {
      el.classList.remove('error');
    });
    alertElement.style.display = 'none';

    // Проверка обязательных полей
    if (!formData.name.trim()) {
      showError(document.getElementById('name'));
      isValid = false;
    }

    if (!formData.email.trim()) {
      showError(document.getElementById('email'));
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      showError(document.getElementById('email'));
      isValid = false;
    }

    if (!formData.phone || formData.phone.length < 5) {
      showError(document.getElementById('phone'));
      isValid = false;
    }

    if (!formData.social) {
      showError(document.getElementById('social'));
      isValid = false;
    }

    if (!formData.account || formData.account === 'https://') {
      showError(document.getElementById('account'));
      isValid = false;
    }

    if (!formData.followers) {
      showError(document.getElementById('followers'));
      isValid = false;
    }

    if (!formData.agreement) {
      document
        .getElementById('agreement')
        .closest('.checkbox-group')
        .classList.add('error');
      isValid = false;
    }

    if (!isValid) {
      alertElement.style.display = 'flex';
      window.scrollTo({ top: form.offsetTop - 20, behavior: 'smooth' });
    }

    return isValid;
  }

  // Валидация email
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Показать ошибку
  function showError(field) {
    field.classList.add('error-field');
    field.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (field.type === 'checkbox') {
      field.closest('.checkbox-group').classList.add('error');
    }
  }

  // Инициализация
  initPhoneMask();
  initFollowersMask();
  initSocialAutocomplete();
});
