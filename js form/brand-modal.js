// brand-modal.js
document.addEventListener('DOMContentLoaded', function () {
  // Элементы модального окна брендов
  const brandModal = document.getElementById('brandModal');
  const openBrandModalBtn = document.querySelector('#openBrandModalBtn');
  const closeBrandModalBtn = document.getElementById('closeBrandModalBtn');
  const brandForm = document.getElementById('brand-form');
  const submitBrandBtn = document.getElementById('submitBrandBtn');
  const brandModalContainer = brandModal.querySelector('.modal-container');
  const burgerBtn = document.querySelector('#burgerBtn');

  // Элементы модального окна подтверждения (используем существующее)
  const successModal = document.getElementById('successModal');
  const successModalClose = document.getElementById('successModalClose');

  // Функция открытия модального окна брендов
  function openBrandModal() {
    // Показываем оверлей (сразу видимый)
    brandModal.style.display = 'flex';
    brandModal.style.opacity = '0';
    brandModal.style.visibility = 'visible';
    burgerBtn.style.display = 'none'

    // Сбрасываем transform для анимации
    brandModalContainer.style.transform = 'translateY(20px)';
    brandModalContainer.style.opacity = '0';

    // Запускаем анимацию через RAF для плавности
    requestAnimationFrame(() => {
      // Фон появляется
      brandModal.style.opacity = '1';

      // Контент выезжает
      brandModalContainer.style.transform = 'translateY(0)';
      brandModalContainer.style.opacity = '1';
    });

    // Сбрасываем форму и ошибки
    if (brandForm) {
      brandForm.reset();
      document.getElementById('brandAgreement').checked = false;
      document.getElementById('brandNewsletter').checked = false;

      document.querySelectorAll('.error-field').forEach((el) => {
        el.classList.remove('error-field');
      });
      document.querySelectorAll('.checkbox-group').forEach((el) => {
        el.classList.remove('error');
      });

      // Скрываем общее сообщение об ошибке, если есть
      const brandAlert = document.getElementById('brand-form-alert');
      if (brandAlert) brandAlert.style.display = 'none';
    }

    setTimeout(() => {
      brandModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }, 10);
  }

  // Функция закрытия модального окна брендов
  function closeBrandModal() {
    // Начинаем анимацию закрытия
    brandModal.style.opacity = '0';
    brandModalContainer.style.transform = 'translateY(20px)';
    brandModalContainer.style.opacity = '0';

    setTimeout(() => {
      burgerBtn.style.display = 'flex'
    }, 100);

    // После завершения анимации скрываем полностью
    setTimeout(() => {
      brandModal.style.display = 'none';
      brandModal.style.visibility = 'hidden';
      document.body.style.overflow = '';
    }, 300); // 300ms - длительность анимации
  }

  // Обработчики событий для модального окна брендов
  if (openBrandModalBtn) {
    openBrandModalBtn.addEventListener('click', openBrandModal);
  }

  if (closeBrandModalBtn) {
    closeBrandModalBtn.addEventListener('click', closeBrandModal);
  }

  // Клик по оверлею
  brandModal.addEventListener('click', function (e) {
    if (e.target === brandModal) {
      closeBrandModal();
    }
  });

  // Блокируем всплытие событий от контейнера
  brandModalContainer.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  // Инициализация маски телефона для брендов
  function initBrandPhoneMask() {
    const phoneInput = document.getElementById('contactPhone');
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

  // Обработка отправки формы бренда
  if (submitBrandBtn && brandForm) {
    submitBrandBtn.addEventListener('click', function (e) {
      e.preventDefault();
      handleBrandFormSubmit();
    });
  }

  // Автозаполнение https:// при фокусе на поле сайта
  function initWebsiteField() {
    const websiteInput = document.getElementById('website');
    if (!websiteInput) return;

    // Установка начального значения
    if (!websiteInput.value) {
      websiteInput.value = 'https://';
    }

    // Обработчики событий
    websiteInput.addEventListener('focus', handleWebsiteInput);
    websiteInput.addEventListener('click', handleWebsiteInput);
    websiteInput.addEventListener('input', validateWebsiteInput);

    function handleWebsiteInput() {
      if (!this.value.startsWith('http')) {
        this.value = 'https://';
        // Устанавливаем курсор в конец
        setTimeout(() => {
          this.setSelectionRange(this.value.length, this.value.length);
        }, 0);
      }
    }

    function validateWebsiteInput(e) {
      // Запрещаем удаление "https://"
      if (this.value.length < 8 && this.value.startsWith('https://')) {
        e.preventDefault();
        this.value = 'https://';
      }
    }
  }

  // Функция обработки отправки формы бренда
  function handleBrandFormSubmit() {
    const formData = {
      brandName: document.getElementById('brandName').value,
      categories: document.getElementById('categories').value,
      website: document.getElementById('website').value,
      contactName: document.getElementById('contactName').value,
      contactEmail: document.getElementById('contactEmail').value,
      contactPhone: document.getElementById('contactPhone').value,
      agreement: document.getElementById('brandAgreement').checked,
      newsletter: document.getElementById('brandNewsletter').checked,
    };

    if (!validateBrandForm(formData)) return;

    console.log('Brand form data:', formData);

    // Закрываем модалку бренда и открываем окно подтверждения
    closeBrandModal();
    setTimeout(() => {
      openSuccessModal();
    }, 300);

    // Здесь можно добавить реальную отправку данных на сервер
    // fetch('/api/brand-submit', {
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

  // Валидация формы бренда
  function validateBrandForm(formData) {
    let isValid = true;
    const alertElement =
      brandForm.querySelector('.form-alert') ||
      document.getElementById('brand-form-alert');

    // Сбрасываем предыдущие ошибки
    brandForm.querySelectorAll('.error-field').forEach((el) => {
      el.classList.remove('error-field');
    });
    brandForm.querySelectorAll('.checkbox-group').forEach((el) => {
      el.classList.remove('error');
    });

    if (alertElement) alertElement.style.display = 'none';

    // Проверка обязательных полей
    const requiredFields = [
      'brandName',
      'categories',
      'website',
      'contactName',
      'contactEmail',
      'contactPhone',
    ];

    requiredFields.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      if (!formData[fieldId] || formData[fieldId].trim() === '') {
        field.classList.add('error-field');
        isValid = false;
      }
    });

    // Валидация email
    if (formData.contactEmail && !validateEmail(formData.contactEmail)) {
      document.getElementById('contactEmail').classList.add('error-field');
      isValid = false;
    }

    // Валидация телефона
    if (formData.contactPhone && formData.contactPhone.length < 5) {
      document.getElementById('contactPhone').classList.add('error-field');
      isValid = false;
    }

    // Проверка чекбокса соглашения
    if (!formData.agreement) {
      document
        .getElementById('brandAgreement')
        .closest('.checkbox-group')
        .classList.add('error');
      isValid = false;
    }

    if (!isValid) {
      if (alertElement) {
        alertElement.style.display = 'flex';
      }
      window.scrollTo({ top: brandForm.offsetTop - 20, behavior: 'smooth' });
    }

    return isValid;
  }

  // Общие функции (можно вынести в отдельный файл)
  function openSuccessModal() {
    successModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Закрытие по Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (brandModal.classList.contains('active')) {
        closeBrandModal();
      } else if (successModal.classList.contains('active')) {
        closeSuccessModal();
      }
    }
  });

  // Инициализация
  initBrandPhoneMask();
  initWebsiteField();
});

// Общая функция закрытия success modal
function closeSuccessModal() {
  const successModal = document.getElementById('successModal');
  if (successModal) {
    successModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}
